const fs = require('fs');


//create file-->
// let file = fs.writeFileSync('abc.pdf', 'hello this is pdf file')
// let file = fs.writeFileSync('abc.js', 'hello this is pdf file')


//read file-->
    // let file = fs.readFileSync('abc.js','utf-8');
    // console.log(file)

//updatefile (add more data in a file)-->
    // let file = fs.appendFileSync('abc.js', '\n let x = 5')


//delete file -->
    // let file = fs.unlinkSync('abc.js')

// rename a file-->
    // let file = fs.renameSync('abc.pdf', 'abc.txt')    

//create a folder -->
        // let folder = fs.mkdirSync('public')//
            