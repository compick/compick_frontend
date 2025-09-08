pipeline {
  agent any
  tools { nodejs 'node22' }
  options {
    skipDefaultCheckout(true)
    timeout(time: 25, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  environment {
    SSH_CRED = 'deploy-ssh'
    DEPLOY_DIR = '/home/ec2-user/app/compick'
    NODE_OPTIONS = '--max_old_space_size=1024'
    CI = 'true'
    GENERATE_SOURCEMAP = 'false'
    DISABLE_ESLINT_PLUGIN = 'true'
  }
  triggers { githubPush() }

  stages {
    stage('Checkout'){ steps { checkout scm } }

    stage('Build'){
      steps {
        sh '''
          set -e
          echo "node=$(node -v) npm=$(npm -v)"

          unset NPM_CONFIG_REGISTRY NPM_REGISTRY_URL npm_config_registry
          unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy NO_PROXY no_proxy
          npm config delete proxy || true
          npm config delete https-proxy || true
          npm config delete registry || true

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

          # 메모리 상한 1024MB로 빌드 강제
          node --max-old-space-size=1024 node_modules/react-scripts/scripts/build.js
        '''
      }
    }

    stage('Deploy'){
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
    always { cleanWs() }
    failure { echo '❌ React build/deploy 실패 — 메모리·스왑 상태 확인' }
    success { echo '✅ React 프론트엔드 SSH 배포 성공!' }
  }
}
