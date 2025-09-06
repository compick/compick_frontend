pipeline {
  agent any
  tools { nodejs 'node18' }   // Jenkins Global Tool에 Node.js 등록 필요
  options { skipDefaultCheckout(true) }
  environment {
    SSH_CRED   = 'deploy-ssh'       // SSH key
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
          npm ci || npm install
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
    failure { echo '❌ React build/deploy 실패 — Node.js 환경 & SSH 확인 필요' }
    success { echo '✅ React 프론트엔드 배포 성공!' }
  }
}
