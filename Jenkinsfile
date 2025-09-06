pipeline {
  agent any
  tools { nodejs 'node18' }   // Jenkins Global Tool Configuration > NodeJS installations
  options { skipDefaultCheckout(true) }
  environment {
    SSH_CRED   = 'deploy-ssh'       // Jenkins Credentials: SSH key (username=ec2-user)
    DEPLOY_DIR = '/home/ec2-user/app/compick'
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
          echo "=== npm version check ==="
          node -v
          npm -v

          # 안전하게 npm 공식 레지스트리 강제
          unset NPM_CONFIG_REGISTRY NPM_REGISTRY_URL npm_config_registry
          unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy NO_PROXY no_proxy
          npm config delete proxy || true
          npm config delete https-proxy || true
          npm config delete registry || true

          # 워크스페이스 .npmrc를 강제로 생성
          cat > .npmrc <<'EOF'
registry=https://registry.npmjs.org/
@*:registry=https://registry.npmjs.org/
audit=false
fund=false
EOF

          echo "=== effective registry ==="
          npm config get registry

          # 패키지 설치 & 빌드
          if [ -f package-lock.json ]; then
            npm ci --registry=https://registry.npmjs.org/
          else
            npm install --registry=https://registry.npmjs.org/
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
                # build 결과물을 대상 서버로 전송
                rsync -az --delete ./build/ ec2-user@$h:${DEPLOY_DIR}/compick_frontend/build_new/

                # 대상 서버에서 원자적 교체 및 컨테이너 재기동
                ssh ec2-user@$h "
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
    failure { echo '❌ React build/deploy 실패 — Node.js, 레지스트리, SSH 확인 필요' }
    success { echo '✅ React 프론트엔드 SSH 배포 성공!' }
  }
}
