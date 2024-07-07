pipeline {
    agent any
    environment {
        KUBE_API_SERVER = 'https://kubernetes.docker.internal:6443'
        KUBE_TOKEN = credentials('kubernetes_secret')
        KUBE_NAMESPACE = 'default'
        PATH = "C:\\Users\\PC\\AppData\\Local\\Programs\\Python\\Python312;C:\\Users\\PC\\AppData\\Local\\Programs\\Python\\Python312\\Scripts;${env.PATH}"
    }
    stages {
        stage('Build') {
            steps {
                echo 'building the application..'
                script {
                    dockerImage = docker.build('ericamaya29/user-management:latest', '-f user-management/Dockerfile user-management/.')
                }

            }
        }
        stage('Test Docker Image') {
            steps {
                script {
                    bat 'docker run ericamaya29/user-management:latest npm run test' 
                }
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Autentica y empuja la imagen a Docker Hub
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
                    bat """
                    kubectl config set-cluster docker-desktop --server=${env.KUBE_API_SERVER} --insecure-skip-tls-verify=true
                    kubectl config set-credentials docker-desktop --token=${env.KUBE_TOKEN}
                    kubectl config set-context docker-desktop --cluster=docker-desktop --user=docker-desktop --namespace=${env.KUBE_NAMESPACE}
                    kubectl config use-context docker-desktop
                    """
                    dir('k8s/project') {
                        docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-crd') {
                            bat 'kubectl config view --raw > C:\\Users\\eric_amaya\\.kube\\config'
                            bat 'helm version'
                            bat 'helm install project .'
                            bat 'helm project .'
                            bat 'kubectl port-forward service/user-management-testing 3001:3001 & kubectl port-forward service user-management 3000:3000 &'
                        }
                    }       
                }
            }
        }

    }
}
