const DefaultGraphData = {
  "cells": [
    {
      "type": "devs.Coupled",
      "size": { "width": 300, "height": 300 },
      "inPorts": ["in"],
      "outPorts": ["out 1", "out 2"],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              ".port-label": {
                "fill": "#000"
              },
              ".port-body": {
                "fill": "#fff",
                "stroke": "#000",
                "r": 10,
                "magnet": true
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 10
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              ".port-label": {
                "fill": "#000"
              },
              ".port-body": {
                "fill": "#fff",
                "stroke": "#000",
                "r": 10,
                "magnet": true
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 10
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in",
            "group": "in",
            "attrs": {
              ".port-label": {
                "text": "in"
              }
            }
          },
          {
            "id": "out 1",
            "group": "out",
            "attrs": {
              ".port-label": {
                "text": "out 1"
              }
            }
          },
          {
            "id": "out 2",
            "group": "out",
            "attrs": {
              ".port-label": {
                "text": "out 2"
              }
            }
          }
        ]
      },
      "position": {
        "x": 230,
        "y": 50
      },
      "angle": 0,
      "id": "021109e6-03fa-413c-adc6-46a1e87a02e4",
      "z": 1,
      "embeds": [
        "bd2d3796-247b-4c61-a011-617a1080d747"
      ],
      "attrs": {
        ".body": {
          "rx": 6,
          "ry": 6
        }
      }
    },
    {
      "type": "devs.Atomic",
      "size": {
        "width": 80,
        "height": 80
      },
      "inPorts": [
        "xy"
      ],
      "outPorts": [
        "x",
        "y"
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              ".port-label": {
                "fill": "#000"
              },
              ".port-body": {
                "fill": "#fff",
                "stroke": "#000",
                "r": 10,
                "magnet": true
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 10
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              ".port-label": {
                "fill": "#000"
              },
              ".port-body": {
                "fill": "#fff",
                "stroke": "#000",
                "r": 10,
                "magnet": true
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 10
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "xy",
            "group": "in",
            "attrs": {
              ".port-label": {
                "text": "xy"
              }
            }
          },
          {
            "id": "x",
            "group": "out",
            "attrs": {
              ".port-label": {
                "text": "x"
              }
            }
          },
          {
            "id": "y",
            "group": "out",
            "attrs": {
              ".port-label": {
                "text": "y"
              }
            }
          }
        ]
      },
      "position": {
        "x": 360,
        "y": 260
      },
      "angle": 0,
      "id": "bd2d3796-247b-4c61-a011-617a1080d747",
      "z": 2,
      "parent": "021109e6-03fa-413c-adc6-46a1e87a02e4",
      "attrs": {
        ".body": {
          "rx": 6,
          "ry": 6
        }
      }
    },
    {
      "type": "devs.Atomic",
      "size": {
        "width": 80,
        "height": 80
      },
      "inPorts": [

      ],
      "outPorts": [
        "out"
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              ".port-label": {
                "fill": "#000"
              },
              ".port-body": {
                "fill": "#fff",
                "stroke": "#000",
                "r": 10,
                "magnet": true
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 10
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              ".port-label": {
                "fill": "#000"
              },
              ".port-body": {
                "fill": "#fff",
                "stroke": "#000",
                "r": 10,
                "magnet": true
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 10
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "out",
            "group": "out",
            "attrs": {
              ".port-label": {
                "text": "out"
              }
            }
          }
        ]
      },
      "position": {
        "x": 50,
        "y": 160
      },
      "angle": 0,
      "id": "16e8b085-d323-401c-b8da-bc991d5fda58",
      "z": 3,
      "attrs": {
        ".body": {
          "rx": 6,
          "ry": 6
        }
      }
    },
    {
      "type": "devs.Atomic",
      "size": {
        "width": 100,
        "height": 300
      },
      "inPorts": [
        "a",
        "b"
      ],
      "outPorts": [

      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              ".port-label": {
                "fill": "#000"
              },
              ".port-body": {
                "fill": "#fff",
                "stroke": "#000",
                "r": 10,
                "magnet": true
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 10
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              ".port-label": {
                "fill": "#000"
              },
              ".port-body": {
                "fill": "#fff",
                "stroke": "#000",
                "r": 10,
                "magnet": true
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 10
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "a",
            "group": "in",
            "attrs": {
              ".port-label": {
                "text": "a"
              }
            }
          },
          {
            "id": "b",
            "group": "in",
            "attrs": {
              ".port-label": {
                "text": "b"
              }
            }
          }
        ]
      },
      "position": {
        "x": 650,
        "y": 50
      },
      "angle": 0,
      "id": "8d5f0698-1e72-4b7a-90c5-95c54801cebf",
      "z": 4,
      "attrs": {
        ".body": {
          "rx": 6,
          "ry": 6
        }
      }
    },
    {
      "type": "devs.Link",
      "source": {
        "id": "16e8b085-d323-401c-b8da-bc991d5fda58",
        "port": "out"
      },
      "target": {
        "id": "021109e6-03fa-413c-adc6-46a1e87a02e4",
        "port": "in"
      },
      "id": "413a2f55-b58b-481a-8326-0f7c7db14027",
      "z": 5,
      "attrs": {

      }
    },
    {
      "type": "devs.Link",
      "source": {
        "id": "021109e6-03fa-413c-adc6-46a1e87a02e4",
        "port": "in"
      },
      "target": {
        "id": "bd2d3796-247b-4c61-a011-617a1080d747",
        "port": "xy"
      },
      "id": "9ff22465-54ec-44d9-9aba-0cadf5807af4",
      "z": 6,
      "attrs": {

      }
    },
    {
      "type": "devs.Link",
      "source": {
        "id": "bd2d3796-247b-4c61-a011-617a1080d747",
        "port": "x"
      },
      "target": {
        "id": "021109e6-03fa-413c-adc6-46a1e87a02e4",
        "port": "out 1"
      },
      "id": "9d145a19-83f7-4dbd-8d34-1110f2051d7b",
      "z": 7,
      "attrs": {

      }
    },
    {
      "type": "devs.Link",
      "source": {
        "id": "bd2d3796-247b-4c61-a011-617a1080d747",
        "port": "y"
      },
      "target": {
        "id": "021109e6-03fa-413c-adc6-46a1e87a02e4",
        "port": "out 2"
      },
      "id": "ff0a2d98-41c3-4c9b-9b4d-d643b25d1393",
      "z": 8,
      "attrs": {

      }
    },
    {
      "type": "devs.Link",
      "source": {
        "id": "021109e6-03fa-413c-adc6-46a1e87a02e4",
        "port": "out 1"
      },
      "target": {
        "id": "8d5f0698-1e72-4b7a-90c5-95c54801cebf",
        "port": "a"
      },
      "id": "a8750174-3c3d-49a4-a79c-8e8e4b015637",
      "z": 9,
      "attrs": {

      }
    },
    {
      "type": "devs.Link",
      "source": {
        "id": "021109e6-03fa-413c-adc6-46a1e87a02e4",
        "port": "out 2"
      },
      "target": {
        "id": "8d5f0698-1e72-4b7a-90c5-95c54801cebf",
        "port": "b"
      },
      "id": "85471e2f-3a96-473d-a57c-7bc6db55fcf9",
      "z": 10,
      "attrs": {

      }
    }
  ]
};