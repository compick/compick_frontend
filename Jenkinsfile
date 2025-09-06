pipeline {
  agent any
  tools { nodejs 'node18' }   // Manage Jenkins > Global Tool Configuration > NodeJS installations: name=node18, version=18.20.4
  options { skipDefaultCheckout(true) }
  environment {
    SSH_CRED   = 'deploy-ssh'              // Jenkins Credentials: SSH key (username=ec2-user)
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

          echo "=== npm env sanity ==="
          node -v
          npm -v

          echo "=== BEFORE configs ==="
          npm config get registry || true
          npm config get proxy || true
          npm config get https-proxy || true
          npm config list -l | grep -i registry || true

          # 0) 환경변수/프록시 해제
          unset NPM_CONFIG_REGISTRY NPM_REGISTRY_URL npm_config_registry
          unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy NO_PROXY no_proxy

          npm config delete proxy || true
          npm config delete https-proxy || true
          npm config delete registry || true

          # 1) 사용자/시스템 npmrc 흔적 제거 (있는 경우만)
          rm -f ~/.npmrc /var/jenkins_home/.npmrc || true
          rm -f ~/.config/npm/npmrc || true
          sudo rm -f /etc/npmrc /usr/local/etc/npmrc 2>/dev/null || true

          # 2) 워크스페이스 .npmrc를 "정답"으로 강제
          cat > .npmrc <<'EOF'
registry=https://registry.npmjs.org/
@*:registry=https://registry.npmjs.org/
audit=false
fund=false
EOF

          echo "=== AFTER enforcing workspace .npmrc ==="
          npm config list -l | grep -i registry || true

          # 3) 설치 & 빌드 (CLI --registry도 최우선으로 지정)
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
                rsync -az --delete ./build/ ec2-user@$h:${DEPLOY_DIR}/compick_frontend/build_new/
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
    failure { echo '❌ React build/deploy 실패 — Node.js, 레지스트리, SSH 설정 확인' }
    success { echo '✅ React 프론트엔드 배포 성공!' }
  }
}
