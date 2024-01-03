variable "TAG" {
  default = "latest"
}

variable "REGISTRY-OLD" {
  default = "370394081373.dkr.ecr.us-west-2.amazonaws.com/payarc-test-build"
}
variable "REGISTRY" {
    default = "<image-name>"
}
group "default" {
  targets = ["webapp"]
}

target "webapp" {
  context = "<context-dir>"
  dockerfile = "Dockerfile"
  tags = ["${REGISTRY}:${TAG}"]
  args = {
    batch_server="false"
    COMPILE_VUE="true"
    NEW_RELIC_LICENSE_KEY=""
    NEW_RELIC_AGENT_VERSION="10.0.0.312"
    NEW_RELIC_APPNAME="payarc-admin-portal-prod"
    GITHUB_ACCESS_KEY="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"
  }
}

