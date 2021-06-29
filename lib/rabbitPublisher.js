const R = require("ramda");

module.exports = ({ rabbitBroker, publicationName }) => {
  const { publications } = rabbitBroker.getConfig();

  if (!publications[publicationName]) {
    throw new Error(
      `RabbitPublisher - requires ${publicationName} to be configured within 'publications' object in rabbit config!`
    );
  }

  return {
    publish: ({ payload, overrides = {} }) => {
      const overridesWithDefaults = R.mergeDeepRight(overrides, {
        options: {}
      });

       return new Promise((resolve, reject) => {
        rabbitBroker
          .getRascalBroker()
          .then(broker => {
            broker.publish(
              publicationName,
              payload,
              overridesWithDefaults,
              (err, publication) => {
                console.log("Got publication");
                if (err) {
                  reject(err);
                } else {
                  publication.on("success", resolve).on("error", reject);
                }
              }
            );
          })
          .catch(reject);
      });
    }
  };
};
