var Transition = HybridUI.components.Transition;

DEFAULT_TRANSITIONS = {
  Fade: [

    // Fade In
    {
      in: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              'z-index': 2,
              opacity: 0,
              position: [0, 0]
            }
          }, {
            percent: 1,
            properties: {
              opacity: 1
            }
          }]
        });
      },
      out: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              'z-index': 1,
              opacity: 1,
              position: [0, 0]
            }
          }, {
            percent: 1,
            properties: {
              opacity: 0
            }
          }]
        });
      }
    },

    // Fade Out
    {
      in: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              'z-index': 1,
              opacity: 0,
              position: [0, 0]
            }
          }, {
            percent: 1,
            properties: {
              'z-index': 2,
              opacity: 1
            }
          }]
        });
      },
      out: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              opacity: 1,
              position: [0, 0]
            }
          }, {
            percent: 1,
            properties: {
              opacity: 0
            }
          }]
        });
      }
    }
  ],

  SlideHorizontal: [

    // Left
    {
      in: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              position: [size[0], 0]
            }
          }, {
            percent: 1,
            properties: {
              position: [0, 0]
            }
          }]
        });
      },
      out: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              position: [0, 0]
            }
          }, {
            percent: 1,
            properties: {
              position: [-size[0], 0]
            }
          }]
        });
      }
    },

    // Right
    {
      in: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              position: [-size[0], 0]
            }
          }, {
            percent: 1,
            properties: {
              position: [0, 0]
            }
          }]
        });
      },
      out: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              position: [0, 0]
            }
          }, {
            percent: 1,
            properties: {
              position: [size[0], 0]
            }
          }]
        });
      }
    }
  ],

  SlideVertical: [

    // Left
    {
      in: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              position: [0, size[1]],
              opacity: 0
            }
          }, {
            percent: 1,
            properties: {
              position: [0, 0],
              opacity: 1
            }
          }]
        });
      },
      out: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              position: [0, 0],
              opacity: 1
            }
          }, {
            percent: 1,
            properties: {
              position: [0, -size[1]],
              opacity: 0
            }
          }]
        });
      }
    },

    // Right
    {
      in: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              position: [0, -size[1]],
              opacity: 0
            }
          }, {
            percent: 1,
            properties: {
              position: [0, 0],
              opacity: 1
            }
          }]
        });
      },
      out: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              position: [0, 0],
              opacity: 1
            }
          }, {
            percent: 1,
            properties: {
              position: [0, size[1]],
              opacity: 0
            }
          }]
        });
      }
    }
  ],

  SlideOverVertical: [

    // Up
    {
      in: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              'z-index': 2,
              position: [0, size[1]]
            }
          }, {
            percent: 1,
            properties: {
              position: [0, 0]
            }
          }]
        })
      },
      out: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              'z-index': 1,
              position: [0, 0]
            }
          }]
        });
      }
    },

    // Down
    {
      in: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              'z-index': 1,
              position: [0, 0]
            }
          }]
        })
      },
      out: function (size) {
        return new Transition({
          steps: [{
            percent: 0,
            properties: {
              'z-index': 2,
              position: [0, 0]
            }
          }, {
            percent: 1,
            properties: {
              position: [0, size[1]]
            }
          }]
        })
      }
    }
  ]
}