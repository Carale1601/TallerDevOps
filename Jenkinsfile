pipeline {
    agent any
    environment {
        KUBECONFIG = credentials('KUBECONFIG')
        DATABASE_PATH = credentials('DATABASE_PATH')
    }
    stages {
        stage('Set Environment Variables') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        env.PORT = credentials('PROD_PORT')
                        env.DOCKER_REPO = 'ericamaya29/user-management:latest'
                        env.HELM_CHART = 'production'
                    } else if (env.BRANCH_NAME == 'testing') {
                        env.PORT = credentials('DEV_PORT')
                        env.DOCKER_REPO = 'ericamaya29/user-management-testing:latest'
                        env.HELM_CHART = 'testing'
                    }
                }
            }
        }
        stage('Build') {
            steps {
                echo 'building the application..'
                script {
                    dockerImage = docker.build(env.DOCKER_REPO, '--build-arg PORT=${PORT} --build-arg DATABASE_PATH=${DATABASE_PATH} -f user-management/Dockerfile user-management/.')
                }

            }
        }
        stage('Test Docker Image') {
            steps {
                script {
                    bat 'docker run ${env.DOCKER_REPO} npm run test' 
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-crd') {
                        dockerImage.push("latest")
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    dir('k8s/${env.HELM_CHART}') {
                        bat 'helm version'
                        bat 'kubectl config view'
                        bat 'kubectl config get-contexts'

                        script {
                            def releaseExists = bat(script: 'helm status ${env.HELM_CHART}', returnStatus: true) == 0
                            if (releaseExists) {
                                echo 'Existing project found, uninstalling...'
                                bat 'helm uninstall ${env.HELM_CHART}'
                            } else {
                                echo 'No existing project found.'
                            }
                        }

                        bat 'helm install ${env.HELM_CHART} .'
                        bat 'helm upgrade ${env.HELM_CHART} .'
                        bat 'kubectl get services'
                        bat 'kubectl get pods'
                    }       
                }
            }
        }

    }
}
