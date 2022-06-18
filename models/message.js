ttps://github.com/soleimygomez/BackendTurnador
 * branch            main       -> FETCH_HEAD
Already up to date.
[root@ip-172-31-46-68 BackendTurnador]# ip config
Object "config" is unknown, try "ip help".
[root@ip-172-31-46-68 BackendTurnador]# ^C
[root@ip-172-31-46-68 BackendTurnador]# cd ..
[root@ip-172-31-46-68 ec2-user]# ls
BackendTurnador  BackendTurnadorRespaldo  google-chrome-stable_current_x86_64.rpm
[root@ip-172-31-46-68 ec2-user]# cd BackendTurnador
[root@ip-172-31-46-68 BackendTurnador]# ls
files  index.js  models  package.json  package-lock.json  Procfile  README.md  src
[root@ip-172-31-46-68 BackendTurnador]# git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
[root@ip-172-31-46-68 BackendTurnador]# git checkout -b cambiosListen
Switched to a new branch 'cambiosListen'
[root@ip-172-31-46-68 BackendTurnador]# git push origin cambiosListen
Username for 'https://github.com': engr-dani-hayat
Password for 'https://engr-dani-hayat@github.com':
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
remote:
remote: Create a pull request for 'cambiosListen' on GitHub by visiting:
remote:      https://github.com/soleimygomez/BackendTurnador/pull/new/cambiosListen
remote:
remote: GitHub found 3 vulnerabilities on soleimygomez/BackendTurnador's default branch (1 critical, 2 high). To find out more, visit:
remote:      https://github.com/soleimygomez/BackendTurnador/security/dependabot
remote:
To https://github.com/soleimygomez/BackendTurnador.git
 * [new branch]      cambiosListen -> cambiosListen
[root@ip-172-31-46-68 BackendTurnador]# ls
files  index.js  models  package.json  package-lock.json  Procfile  README.md  src
[root@ip-172-31-46-68 BackendTurnador]# cd models/
[root@ip-172-31-46-68 models]# ls
auth.js  comment.js  message.js  rol.js  user.js
[root@ip-172-31-46-68 models]# nano message.js
[root@ip-172-31-46-68 models]# nano messageListen.js
[root@ip-172-31-46-68 models]# nano message.js
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('message', {
    idMessage: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: null
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    idComment: {
      type: DataTypes.STRING,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    clientNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },idUser: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null,
    },
    createdAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
  }, {,
  }, {
    tableName: 'message'
  });

};

