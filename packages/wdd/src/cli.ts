const [, , command = "help"] = process.argv;

if (command === "help") {
  console.log("wdd commands: index, impact, session, drift, verify");
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}
