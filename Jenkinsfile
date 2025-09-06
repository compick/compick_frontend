pipeline {
  agent any
  tools { nodejs 'node18' }   // Manage Jenkins > Global Tool Configuration > NodeJS installations: name=node18, version=18.20.4
  options { skipDefaultCheckout(true) }
  environment {
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

          # 레지스트리/프록시 오염 방지
          unset NPM_CONFIG_REGISTRY NPM_REGISTRY_URL npm_config_registry
          unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy NO_PROXY no_proxy
          npm config delete proxy || true
          npm config delete https-proxy || true
          npm config delete registry || true

          rm -f .npmrc ~/.npmrc /var/jenkins_home/.npmrc ~/.config/npm/npmrc || true

          # 워크스페이스 .npmrc를 "정답"으로 강제
          cat > .npmrc <<'EOF'
registry=https://registry.npmjs.org/
@*:registry=https://registry.npmjs.org/
audit=false
fund=false
EOF

          echo "=== AFTER enforcing workspace .npmrc ==="
          npm config list -l | grep -i registry || true

          # 설치 & 빌드 (CLI --registry 최우선)
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
        sh '''
          set -e
          echo "Deploying locally to ${DEPLOY_DIR} ..."

          # 새 빌드 준비
          rm -rf ${DEPLOY_DIR}/compick_frontend/build_new
          mkdir -p ${DEPLOY_DIR}/compick_frontend/build_new

          # 빌드 산출물 복사
          cp -r build/* ${DEPLOY_DIR}/compick_frontend/build_new/

          # 원자적 교체
          cd ${DEPLOY_DIR}
          TS=$(date +%F-%H%M%S)
          if [ -d compick_frontend/build ]; then
            mv compick_frontend/build compick_frontend/build_old_$TS
          fi
          mv compick_frontend/build_new compick_frontend/build

          # Nginx 프론트엔드 컨테이너 재기동
          docker compose up -d --force-recreate frontend
        '''
      }
    }
  }

  post {
    failure { echo '❌ React build/deploy 실패 — Node.js/레지스트리/로컬복사/compose 확인' }
    success { echo '✅ React 프론트엔드 배포 성공 (로컬 복사 방식)!' }
  }
}
