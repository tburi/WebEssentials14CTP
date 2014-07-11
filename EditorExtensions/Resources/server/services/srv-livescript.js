//#region Imports
var livescript = require("LiveScript"),
    fs = require("fs"),
    xRegex = require("xregexp").XRegExp;
//#endregion

//#region Handler
var handleLiveScript = function (writer, params) {
    var options = {
        filename: params.sourceFileName,
        bare: params.bare !== null
    };

    fs.readFile(params.sourceFileName, 'utf8', function (err, data) {
        if (err) {
            writer.write(JSON.stringify({ Success: false, Remarks: "LiveScript: Error reading input file.", Details: err }));
            writer.end();
            return;
        }

        try {
            compiled = livescript.compile(data, options);

            writer.write(JSON.stringify({
                Success: true,
                Remarks: "Successful!",
                Output: {
                    Content: compiled
                    // Maps aren't supported yet: https://github.com/gkz/LiveScript/issues/452
                }
            }));
            writer.end();
        } catch (error) {
            var regex = xRegex.exec(error, xRegex("(?<fullMessage>(?<message>.*line (?<Line>\\d))\nat (?<fileName>.*))", 'gi'));
            writer.write(JSON.stringify({
                Success: false,
                Remarks: "LiveScript: An error has occured while processing your request.",
                Details: regex.message,
                Errors: {
                    Line: regex.Line,
                    FileName: regex.fileName,
                    Message: regex.message,
                    FullMessage: regex.fullMessage
                }
            }));
            writer.end();
        }
    });
};
//#endregion

//#region Exports
module.exports = handleLiveScript;
//#endregion
