# collab-d3-meteor

Project that will eventually show various uses of [meteor](http://meteor.com/) and [d3](http://d3js.org/) to build collaborative diagramming like functionality

This README will be updated as the project it flushed out and functinality is added.

Based on the work of [bollwyvl](https://github.com/bollwyvl) in his [Card gist](https://gist.github.com/bollwyvl/5599335). It currently shares the same limitations (namely Chrome only). 
In addition the meteor example [parties](http://meteor.com/examples/parties) was used as a starting point for some of the d3/meteor interaction (and some of the functions are shamelessly taken from there).

# Notes
* console.log statements are left in for now while I get this running. Sue me.
* I have a great deal of commented out code in there right now while I'm plaing and learning. again, sue me. I'll remove it later.

# Setup
* For now, set up a meteor environment as per the instructions on the [meteor site](http://docs.meteor.com/). This has been tested using an Ubuntu 12.04 server for the meteor environment in VirtualBox
* Clone this repository into the meteor server
* cd into the root directory of the repository and run the command 'meteor'
* Hit the server via web browser (by default meteor serves on port 3000, you may need to adjust port forwarding settings depending on the setup of your virtual machine)
* You can set up different users in different instances of Chrome and show the collaborative nature of the application.