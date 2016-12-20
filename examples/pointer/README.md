# Overview

This example demonstrates how the Activity API can be used to implement collaboration awareness of mouse pointers.  The example allows users to join the activity which immediately shares their mouse pointer.  The mouse pointer is transmitted as a simple (x, y) coordinate. In addition the example shows where and when users click by visualizing the clicks through animations.

The activity API takes care tracking users as they join and leave and cleaning up the shared state of users as they leave the activity.
