/*
   ___             _            _____           _       _
  |_  |           (_)          /  ___|         (_)     | |
    | |_   _ _ __  _  ___  _ __\ `--.  ___ _ __ _ _ __ | |_
    | | | | | '_ \| |/ _ \| '__|`--. \/ __| '__| | '_ \| __|
/\__/ / |_| | | | | | (_) | |  /\__/ / (__| |  | | |_) | |_
\____/ \__,_|_| |_|_|\___/|_|  \____/ \___|_|  |_| .__/ \__|
                                                 | |
                                                 |_|
JuniorScript Alpha V1 is created by JuniorCode.
https://www.github.com/JuniorCode
*/

console.log('%c JuniorScript Alpha 1', 'background: #0070ff; color: #ffffff');

function error(error) {
  alert("JuniorScript Error: " + error);
  throw new Error("JuniorScript Error: " + error);
}

function eval_jrs(input_code) {
  var code = input_code.replace(/\t/g , "");
  var variables = [];
  var values = [];
  var last = "";
  var statement = "none";
  var split_code = code.replace('\t', '').split("\n");

  for (var i = 0; i < split_code.length; i++) {

    var split_command = split_code[i].split(" ");

    if (split_command[0] == "about") {
      alert("JuniorScript Alpha V1 is currently running.");
    }
     
    if (split_command[0] == "reload") {
      window.location.reload();
    }
      
    if (split_command[0] == "exit" || split_command[0] == "die") {
      split_command.shift();
      document.documentElement.innerHTML = split_command.join(" ");
    }

    if (split_command[0] == "out") {
      if (split_command[1] == "=") {
        error("Undeclared context on line " + (i + 1) + ".");
      }

      split_command.shift();

      if (split_command[0] == "(func)") {
        split_command.shift();
      } else {
        for (var k = 0; k < split_command.length; k++) {
          for (var l = 0; l < variables.length; l++) {
            split_command[k] = split_command[k].replace("(" + variables[l] + ")", values[l]);
          }

          split_command[k] = split_command[k].replace("(last)", last);
        }
      }

      var out_cmd = "";

      for (var j = 0; j < split_command.length; j++) {
        if (split_command[j] == "(last)") {
          split_command[j] = last;
        }

        if (j == 0) {
          var out_cmd = out_cmd + split_command[j];
        } else {
          var out_cmd = out_cmd + " " + split_command[j];
        }
      }

      document.body.innerHTML += out_cmd;
    }

    if (split_command[0] == "in") {
      if (split_command[1] == "=") {
        error("Undeclared context on line " + (i + 1) + ".");
      }

      statement = "prompt";

      split_command.shift();

      if (split_command[0] == "(func)") {
        split_command.shift();
      } else {
        for (var k = 0; k < split_command.length; k++) {
          for (var l = 0; l < variables.length; l++) {
            split_command[k] = split_command[k].replace("(" + variables[l] + ")", values[l]);
          }

          split_command[k] = split_command[k].replace("(last)", last);
        }
      }

      var in_cmd = split_command[0];

      for (var j = 1; j < split_command.length; j++) {
        in_cmd = in_cmd + " " + split_command[j];
      }

      var last = prompt(in_cmd);

    }

    if (split_command[1] == "=") {
      var set_value;
      statement = "variable";
      variables.push(split_command[0]);
      split_command.shift();
      for (var m = 0; m < split_command.length; m++) {
        if (m == 0) {
          set_value = split_command[m];
        } else {
          set_value = " " + split_command[m];
        }
      }

      values.push(set_value)
    }

    if (split_command[0] == "if") {
      statement = "if";
    }

    if (split_command[0] == "and") {
      statement = "end if";
    }

    if (statement == "end if") {
      eval_jrs(split_command[i + 1])
      statement = "none";
    }

  }
}

var tags = document.getElementsByTagName("script");
var temp_code;

for (var i = 0; i < tags.length; i++) {
  if (tags[i].type.toLowerCase().indexOf("juniorscript") > -1) {
     temp_code = tags[i].innerHTML;
     eval_jrs(temp_code);
  }
}
