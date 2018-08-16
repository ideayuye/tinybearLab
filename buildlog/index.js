var Git = require("nodegit");
var path = require('path');
var gitDir =  path.resolve( __dirname, "../");
 
// Open the repository directory.
Git.Repository.open(gitDir)
  // Open the master branch.
  .then(function(repo) {
    return repo.getMasterCommit();
  })
  // Display information about commits on master.
  .then(function(firstCommitOnMaster) {
    // Create a new history event emitter.
    var history = firstCommitOnMaster.history();
 
    // Create a counter to only show up to 9 entries.
    var count = 0;
 
    // Listen for commit events from the history.
    history.on("commit", function(commit) {
      // Disregard commits past 9.
      if (++count >= 2) {
        return;
      }
 
      // Show the commit sha.
      console.log("commit " + commit.sha());
 
      // Store the author object.
      var author = commit.author();
 
      // Display author information.
      console.log("Author:\t" + author.name() + " <" + author.email() + ">");
 
      // Show the commit date.
      console.log("Date:\t" + commit.date());
 
      // Give some space and show the message.
      console.log("\n    " + commit.message());
    });
 
    // Start emitting events.
    history.start();
  });

  console.log('end', path.resolve( __dirname, "../"), module)

  console.log('-------------------')
  const { spawn } = require('child_process');
  const ls = spawn('git', ['log', '--pretty="%H:%cd:%an"', '-1']);
  
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
