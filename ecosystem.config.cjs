module.exports = {
  apps: [{
    name: 'Clinic-Internal',
    script: './.output/server/index.mjs',
    env: {
      PORT: 3002
    }
  }]
}
