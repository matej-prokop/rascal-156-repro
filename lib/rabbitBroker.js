const R = require("ramda");
const { BrokerAsPromised: Broker } = require("rascal");
const { defaultConfig } = require("./rascalConfig");

module.exports = ({
  config,
  errorHandler,
  logger,
  rascalDefaults = defaultConfig
}) => {
  let broker;
  let startingPromise = null;

  const start = async () => {
    try {
      startingPromise = Broker.create(
        R.merge(rascalDefaults, {
          vhosts: {
            "/": { ...config }
          }
        })
      );
      broker = await startingPromise;
      startingPromise = null;
    } catch (err) {
      startingPromise = null;
      throw err;
    }
    broker.on(
      "error",
      errorHandler.handleError("RabbitBroker (rascal) - error")
    );

    logger.info("Started RabbitBroker (rascal).");
    return broker;
  };

  const close = () => {
    return (
      broker &&
      broker
        .shutdown()
        .then(() => {
          logger.info("Stopped Rabbit RabbitBroker (rascal).");
        })
        .catch(
          errorHandler.handleError("Error when closing RabbitBroker (rascal)")
        )
    );
  };

  const getRascalBroker = () => {
    return new Promise((resolve, reject) => {
      if (broker) {
        resolve(broker);
      } else if (startingPromise) {
        resolve(startingPromise);
      } else {
        start().then(resolve).catch(reject);
      }
    });
  };

  const getConfig = () => config;

  return {
    start,
    close,
    getRascalBroker,
    getConfig
  };
};
