const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const fs = require('fs');

const app = new Koa({
  proxy: true
});

const router = new Router();

const templatePath = `./index.html`;
let template = '';
if (fs.existsSync(templatePath)) {
  template = fs.readFileSync(templatePath, 'utf-8');
}

router.all('*', async (ctx, next) => {
  ctx.body = template;
});

app.use(koaStatic(__dirname + '/dist/'));

app.use(router.routes()).use(router.allowedMethods());

const port = 8001;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
