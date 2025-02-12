pipeline {
    agent any
    environment {
        KUBECONFIG = credentials('KUBECONFIG')
        DATABASE_PATH = credentials('DATABASE_PATH')
        PROD_PORT = credentials('PROD_PORT')
        DEV_PORT = credentials('DEV_PORT')
    }
    stages {
        stage('Set Environment') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        env.PORT = env.PROD_PORT
                        env.DOCKER_REPO = 'carale/user-management:latest'
                        env.HELM_CHART = 'production'
                    } else { 
                        env.PORT = env.DEV_PORT
                        env.DOCKER_REPO = 'carale/user-management-testing:latest'
                        env.HELM_CHART = 'testing'
                    }
                }
            }
        }
        stage('Build Image') {
            steps {
                echo 'building the application..'
                script {
                    dockerImage = docker.build("${env.DOCKER_REPO}", "--build-arg PORT=${env.PORT} --build-arg DATABASE_PATH=${env.DATABASE_PATH} -f user-management/Dockerfile user-management/.")
                }

            }
        }
        stage('Test Docker Image') {
            steps {
                script {
                    bat "docker run ${env.DOCKER_REPO} npm run test" 
                }
            }
        }

        stage('Push Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'testing'
                }
            }
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerjuf') {
                        dockerImage.push("latest")
                        dockerImage.push('latest')
                    }
                }
            }
        }
        //test 3

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'testing'
                }
            }
            steps {
                script {
                    dir("k8s/${env.HELM_CHART}") {
                        bat 'helm version'
                        bat 'kubectl config view'
                        bat 'kubectl config get-contexts'

                        script {
                            def releaseExists = bat(script: "helm status ${env.HELM_CHART}", returnStatus: true) == 0
                            if (releaseExists) {
                                echo 'Existing project found, updating...'
                                bat "helm upgrade ${env.HELM_CHART} ."
                            } else {
                                echo 'Installing project...'
                                bat "helm install ${env.HELM_CHART} ."
                            }
                        }
                        bat 'kubectl get services'
                        bat 'kubectl get pods'
                    }       
                }
            }
        }

    }
}
