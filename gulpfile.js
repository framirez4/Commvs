var gulp = require('gulp');

gulp.task('setup', function(){
  var envFile = 'DB_HOST=mongodb://localhost:27017/kapeloi\nPORT=8000\nSECRET=secretPass';
  require('fs').writeFileSync('./.env', envFile);
});
