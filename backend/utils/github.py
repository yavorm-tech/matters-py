from github import Github, Auth
import os


class manageGitHub:
    def __init__(self, token):
        self.token = token
        auth = Auth.Token(token)
        self.g = Github(auth=auth)

    def getRepos(self):
        org_payarc = self.g.get_user().get_orgs()[0]
        repos = org_payarc.get_repos()
        return (repos)

    def getBranches(self, repo_name):
        repo = self.g.get_repo(repo_name)
        branches = repo.get_branches()
        return (branches)


def getGitCredentials(git_user=None, git_passwd=None):
    git_user = git_user if (git_user) else os.environ.get('GIT_USER')
    git_passwd = git_passwd if (git_passwd) else os.environ.get('GIT_PASSWD')
    return git_user, git_passwd


def removeFile(fname):
    os.remove(fname)
