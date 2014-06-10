/**
 * stringbuilder.js
 * Adapted from code found at
 * http://www.codeproject.com/Articles/12375/JavaScript-StringBuilder
 * which is licensed by this license:
 * http://www.codeproject.com/info/cpol10.aspx
 */
// Initializes a new instance of the StringBuilder class
// and appends the given value if supplied
function StringBuilder(value)
{
    this.strings = new Array("");
    this.append(value);
}

// Appends the given value to the end of this instance.
StringBuilder.prototype.append = function (value)
{
    if (value)
    {
        this.strings.push(value);
    }
};

// Clears the string buffer
StringBuilder.prototype.clear = function ()
{
    this.strings.length = 1;
};

// Converts this instance to a String.
StringBuilder.prototype.toString = function ()
{
    return this.strings.join("");
};

module.exports = StringBuilder;