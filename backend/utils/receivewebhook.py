class ParseGitPayload:
    def __init__(self, payload):
        self.payload = payload

    def getRepoName(self):
        try:
            repo_name = self.payload['repository']['name']
            return repo_name
        except Exception as e:
            print(e)

    def getRepoId(self):
        try:
            repo_name = self.payload['repository']['id']
            return repo_name
        except Exception as e:
            print(e)

    def getOwnerName(self):
        try:
            repo_name = self.payload['repository']['owner']['name']
            return repo_name
        except Exception as e:
            print(e)

    def getOwnerId(self):
        try:
            repo_name = self.payload['repository']['owner']['id']
            return repo_name
        except Exception as e:
            print(e)

    def getHtmlUrl(self):
        try:
            repo_name = self.payload['repository']['html_url']
            return repo_name
        except Exception as e:
            print(e)

    def getGitUrl(self):
        try:
            repo_name = self.payload['repository']['git_url']
            return repo_name
        except Exception as e:
            print(e)

    def getDefaultBranch(self):
        try:
            repo_name = self.payload['repository']['default_branch']
            return repo_name
        except Exception as e:
            print(e)

    def getMasterBranch(self):
        try:
            repo_name = self.payload['repository']['master_branch']
            return repo_name
        except Exception as e:
            print(e)

    def getBaseRef(self):
        try:
            repo_name = self.payload['repository']['base_ref']
            return repo_name
        except Exception as e:
            print(e)

    def getCommits(self):
        try:
            repo_name = self.payload['commits']
            return repo_name
        except Exception as e:
            print(e)

    def getCommitId(self):
        try:
            repo_name = self.payload['commits'][0]['id']
            return repo_name
        except Exception as e:
            print(e)

    def getCommitMessage(self):
        try:
            repo_name = self.payload['commits'][0]['message']
            return repo_name
        except Exception as e:
            print(e)

    def getCommitUrl(self):
        try:
            repo_name = self.payload['commits'][0]['url']
            return repo_name
        except Exception as e:
            print(e)

    def getCommitAuthorName(self):
        try:
            repo_name = self.payload['commits'][0]['author']['name']
            return repo_name
        except Exception as e:
            print(e)

    def getCommitUsername(self):
        try:
            repo_name = self.payload['commits'][0]['author']['username']
            return repo_name
        except Exception as e:
            print(e)

    def getCommitModifiedFiles(self):
        try:
            repo_name = self.payload['commits'][0]['modified']
            return repo_name
        except Exception as e:
            print(e)

    def getCommitAddedFiles(self):
        try:
            repo_name = self.payload['commits'][0]['added']
            return repo_name
        except Exception as e:
            print(e)

    def getCommitRemovedFiles(self):
        try:
            repo_name = self.payload['commits'][0]['removed']
            return repo_name
        except Exception as e:
            print(e)
