pipeline {
  agent any
  tools { nodejs 'node22' } // Jenkins > Global Tool Configuration 에 Node.js 22.17.0 등록
  options {
    skipDefaultCheckout(true)
    timeout(time: 25, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  environment {
    SSH_CRED = 'deploy-ssh'                         // Jenkins Credentials: SSH key (username=ec2-user)
    DEPLOY_DIR = '/home/ec2-user/app/compick'
    NODE_OPTIONS = '--max_old_space_size=1024'
    CI = 'true'
    GENERATE_SOURCEMAP = 'false'
    DISABLE_ESLINT_PLUGIN = 'true'
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
          echo "node=$(node -v) npm=$(npm -v)"

          # 레지스트리/프록시 초기화
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

          if [ -f package-lock.json ]; then
            npm ci --no-audit --no-fund --registry=https://registry.npmjs.org/
          else
            npm install --no-audit --no-fund --registry=https://registry.npmjs.org/
          fi

          # 메모리 상한 1024MB로 CRA 빌드
          node --max-old-space-size=1024 node_modules/react-scripts/scripts/build.js
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

                # 원격 준비
                ssh -o StrictHostKeyChecking=accept-new ec2-user@$h "mkdir -p ${DEPLOY_DIR}/compick_frontend/build_new && rm -rf ${DEPLOY_DIR}/compick_frontend/build_new/*"

                # 산출물 업로드 (rsync 대신 scp)
                scp -r -o StrictHostKeyChecking=accept-new ./build/* ec2-user@$h:${DEPLOY_DIR}/compick_frontend/build_new/

                # 원자 교체 + 컨테이너 재기동
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
    always { cleanWs() }
    failure { echo '❌ React build/deploy 실패 — 환경(메모리/SSH) 점검' }
    success { echo '✅ React 프론트엔드 SSH 배포 성공' }
  }
}
