# Coding Style

# Donts with certain restrictions
- Never modify prototypes of (standard) libraries (unless as there is no really really really really good reason). Extend them instead.
- Avoid unused code
- Dont use var-keyword
# Would be nice if you do it
- Write js/ts doc comments to public methods and fields


## General formatting
- Dont use braces around single parameters in arrow functions
- Dont use curly braces on single statement arrow statements
- Single statement functions should be one line
- Use ES6 Syntax in typescript
- Dont comment the obvious and leave more complex stuff uncommented
- Use semicolons
- Only use single quotes

## General naming
- Use meaningful names. A variable should describe their function in code, that you dont need comments
- Dont use _ in names, use camel case
- methods and variables start in lower case. constructor like functions always start in upper case
- For readability start only observables with $
- Write your method names out ( such as a foo.2String() method save you one character and you win nothing with it )
- Interfaces in typescript shouldnt begin with I (like IFoo). Use Java conventions instead.


# Architechture and general coding guidlines
- Object types without any logic should be defined in interfaces and created with a Factory.
- Add type guards for types that dont allow `instanceof`
- DTOs and VOs are currently not distinguishable and act like one layer. Please follow following naming for your Classes/Interfaces/Types
`SmObjectName` (Sm would mean ServiceModel)
- Be generic whenever its reusable or senseful to be generic
- Every local filesystem based stuff should be handled in the local backend.
- Dont do prototype based architecture. use classes instead.
- Dont be shy about typing your functions and variables
- Catch your promises properly
- Avoid unused and redundant code
- We are not strict about private/public. If the setters are not really checking data, its no difference from the logic side on.
- Unchanging variables or field should be const or readonly

# Commit
- Split your commits in senseful parts. Everything thats independent from each other shouldnt be committed together.
- Fix up your commits if it makes sense
- Make sure every commit is runnable. For instance, dont commit something that relates to a commit with files ord functionality in a later commit
 That will also count for code, that is more like an experiment, or not working, or not implemented at all.
- Commit messages start in upper case
- Make proper and meaningful commit messages. Something like "fix bug" will not give any advantage or information. Be precise and short.
- Use the following message scheme `When applied, this commit will: ~here your meaningful description for your commit~`
- Good examples for commit messages
```
- Implement connector class that create a facade for the the fetch api
- Fix color highlighting
- Add registration for custom url schemes
```
- Write your words out unless its a really common short cut
- Good goal would be 30-50 lines per commit (in some cases like moving files or creating new ones with a bunch of implementations you can ignore this)
