function getBasePath(req){
    return `${req.protocol}://${req.get('host')}`;
}
module.exports = getBasePath;