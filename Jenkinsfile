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

          echo "[before] npm registry = $(npm config get registry || true)"

          # 1) 모든 오염 설정 해제 (env/proxy/.npmrc)
          unset NPM_CONFIG_REGISTRY NPM_REGISTRY_URL npm_config_registry
          unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy NO_PROXY no_proxy

          npm config delete proxy || true
          npm config delete https-proxy || true
          npm config delete registry || true

          rm -f .npmrc ~/.npmrc /var/jenkins_home/.npmrc || true

          # 2) 공식 레지스트리로 *CLI 플래그* 사용(최우선)
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
