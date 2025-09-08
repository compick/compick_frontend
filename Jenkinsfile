pipeline {
  agent any
  tools { nodejs 'node22' } // Node.js 22.17.0 (Global Tool에 등록)
  options {
    skipDefaultCheckout(true)
    timeout(time: 25, unit: 'MINUTES')    // 전체 파이프라인 보호
    disableConcurrentBuilds()             // 동시에 2개 이상 실행 금지
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  environment {
    SSH_CRED   = 'deploy-ssh'
    DEPLOY_DIR = '/home/ec2-user/app/compick'
    NODE_OPTIONS = '--max_old_space_size=2048'
    CI = 'true'                           // react-scripts 최적동작 플래그
  }
  triggers { githubPush() }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build') {
      steps {
        sh '''
          set -e
          echo "=== versions ==="
          node -v
          npm -v

          # 프록시/레지스트리 강제 초기화
          unset NPM_CONFIG_REGISTRY NPM_REGISTRY_URL npm_config_registry
          unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy NO_PROXY no_proxy
          npm config delete proxy || true
          npm config delete https-proxy || true
          npm config delete registry || true

          # 워크스페이스 .npmrc 고정
          cat > .npmrc <<'EOF'
registry=https://registry.npmjs.org/
@*:registry=https://registry.npmjs.org/
audit=false
fund=false
EOF

          echo "=== effective registry ==="
          npm config get registry

          if [ -f package-lock.json ]; then
            npm ci --no-audit --no-fund --registry=https://registry.npmjs.org/
          else
            npm install --no-audit --no-fund --registry=https://registry.npmjs.org/
          fi

          npm run build
        '''
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([string(credentialsId: 'frontends-hosts', variable: 'FRONTENDS')]) {
          sshagent(credentials: [env.SSH_CRED]) {
            sh '''
              set -e
              for h in $FRONTENDS; do
                echo "Deploying to $h ..."
                rsync -az --delete ./build/ ec2-user@$h:${DEPLOY_DIR}/compick_frontend/build_new/
                ssh -o StrictHostKeyChecking=accept-new ec2-user@$h "
                  set -e
                  cd ${DEPLOY_DIR} &&
                  TS=\\$(date +%F-%H%M%S) &&
                  [ -d compick_frontend/build ] && mv compick_frontend/build compick_frontend/build_old_\\$TS || true &&
                  mv compick_frontend/build_new compick_frontend/build &&
                  docker compose up -d --force-recreate frontend
                "
              done
            '''
          }
        }
      }
    }
  }

  post {
    aborted {
      sh 'pkill -f "react-scripts build" || true'
      sh 'pkill -f "node .*react-scripts build" || true'
    }
    always {
      cleanWs() // 임시파일 정리로 다음 빌드 안정화
    }
    failure { echo '❌ React build/deploy 실패 — Node/레지스트리/SSH 점검' }
    success { echo '✅ React 프론트엔드 SSH 배포 성공!' }
  }
}
