pipeline {
    agent any

    options {
        timeout(time: 10, unit: 'MINUTES')
        retry(2)
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        REPO_URL = 'https://github.com/malkiAbdelhamid/book-app.git'
        IMAGE_NAME = 'book-app'
        CONTAINER_NAME = 'book-app-container'
        APP_PORT = '3000'
    }

    stages {

        stage("Clone") {
            steps {
                git "${REPO_URL}"
            }
        }

        stage("Install Dependencies") {
            steps {
                sh "npm install"
            }
        }

        stage("Test") {
            steps {
                sh "npm test"
            }
            post {
                always {
                    echo 'Test Completed!'
                }
            }
        }

        stage("Build Image") {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }


        stage("Deploy") {
            steps {
                sh """
                    set -e
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d -p ${APP_PORT}:${APP_PORT} \\
                    --name ${CONTAINER_NAME} \\
                    ${IMAGE_NAME}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    def status = sh(
                        script: "docker ps -q -f name=${CONTAINER_NAME}",
                        returnStdout: true
                    ).trim()

                    if (status) {
                        echo "Container ${CONTAINER_NAME} is running"
                    } else {
                        error "Container ${CONTAINER_NAME} is NOT running"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning ...'
            cleanWs()
        }
    }
}