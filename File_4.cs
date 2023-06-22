local spellcheck = require("spellcheck")

local function checkSpelling(word)
    local isSpelledCorrectly = spellcheck.check(word)
    
    if isSpelledCorrectly then
        print("The word is spelled correctly.")
    else
        print("The word is misspelled.")
    end
end

print("Enter a word to check its spelling:")
local input = io.read()

checkSpelling(input)
