"use strict";

const RabbitPublisher = require("../lib/rabbitPublisher");
const RabbitBroker = require("../lib/rabbitBroker");

const config = {
  rabbit: {
    connection: {
      protocol: "amqps",
      hostname:
        "b-f6fe758b-07f7-4afa-b0ae-302212d604c3.mq.us-west-2.amazonaws.com",
      user: "rascal",
      password: "", // <<< TODO: here you need to provide password
      port: 5671
    },
    exchanges: {
      "my-pipeline-exchange": {
        assert: true,
        type: "topic"
      }
    },
    publications: {
      "pub-my-exchange": {
        exchange: "my-pipeline-exchange",
        routingKey: "some-routing-key",
        options: { contentType: "application/json" }
      }
    }
  }
};

const logger = {
  info: console.log,
  error: console.error
};

const errorHandler = {
  handleError: msg => err => {
    logger.error(`${msg}`, err);
  }
};

const rabbitBroker = RabbitBroker({
  config: config.rabbit, // see Configuration section above
  errorHandler, // from App or WorkerApp
  logger // from App or WorkerApp
});

const rabbitPublisher = RabbitPublisher({
  rabbitBroker,
  publicationName: "pub-my-exchange"
});

const runfn = async () => {
  await rabbitBroker.start();

  for (let i = 0; i < 10000; i++) {
    const payload = {
      timestamp: "2012-04-23T18:25:43.511Z",
      type_id: 5,
      ipaddr: "some-ip-address-2",
      uuid: `123456-${i}`
    };

    const overrides = {
      routingKey: `user.1.`,
      options: {
        timestamp: Date.now(),
        headers: { "x-correlation-id": "123", "x-r": 3 }
      }
    };

    logger.info(`Publishing message #${i}`);

    await Promise.race([
      rabbitPublisher
        .publish({ payload, overrides })
        .catch(
          errorHandler.handleError(`Failed to publish message to RMQ`)
        ),
      new Promise(res =>
        setTimeout(() => {
          res();
        }, 30000)
      )
    ]);

    // using publisher to publish an event into RMQ
  }

  // ...call close on graceful shutdown of your service
  await rabbitBroker.close();
};

runfn()
  .then(() => logger.info("Script finished"))
  .catch(err => logger.error("Script failed, ", err));
