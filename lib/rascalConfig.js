const NO_ACK_DEFAULT = false;

// below are defaults copied from https://github.com/guidesmiths/rascal/blob/master/lib/config/defaults.js and updated
const defaultConfig = {
  defaults: {
    vhosts: {
      publicationChannelPools: {
        regularPool: {
          autostart: false,
          max: 5,
          min: 1,
          evictionRunIntervalMillis: 10000,
          idleTimeoutMillis: 60000,
          testOnBorrow: true
        },
        confirmPool: {
          autostart: false,
          max: 5,
          min: 1,
          evictionRunIntervalMillis: 10000,
          idleTimeoutMillis: 60000,
          testOnBorrow: true
        }
      },
      connectionStrategy: "random",
      connection: {
        slashes: true,
        protocol: "amqp",
        // hostname: "localhost",
        // user: "guest",
        // password: "guest",
        port: "5672",
        options: {
          heartbeat: 10,
          connection_timeout: 10000,
          channelMax: 100
        },
        retry: {
          min: 500,
          max: 30000,
          factor: 2,
          strategy: "exponential"
        },
        socketOptions: {
          timeout: 10000
        }
        // management: {
        //   slashes: true,
        //   protocol: "http",
        //   user: "guest",
        //   password: "guest",
        //   port: 15672,
        //   options: {
        //     timeout: 1000
        //   }
        // }
      },
      exchanges: {
        assert: false,
        // assert: true,
        type: "topic"
      },
      queues: {
        assert: false
        // assert: true
      },
      bindings: {
        destinationType: "queue",
        bindingKey: "#"
      }
    },
    publications: {
      vhost: "/",
      confirm: true,
      options: {
        persistent: true,
        mandatory: true
      }
    },
    subscriptions: {
      options: {
        noAck: NO_ACK_DEFAULT
      },
      // ^ above is our override VS. below is rascal defaults
      vhost: "/",
      prefetch: 10,
      retry: {
        min: 1000,
        max: 60000,
        factor: 2,
        strategy: "exponential"
      },
      redeliveries: {
        limit: 100,
        timeout: 1000,
        // counter: "stub" actually means that redeliveries are not track at all
        counter: "stub"
      },
      deferCloseChannel: 10000
    },
    redeliveries: {
      counters: {
        stub: {},
        inMemory: {
          size: 1000
        }
      }
    }
  }
};

module.exports = {
  defaultConfig
};
