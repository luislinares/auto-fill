const PDFDocument = require('pdfkit');
const fs = require('fs');
const readline = require('readline');
const Promise = require('bluebird');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Puts data into your copy clipboard
// Works for OSX only
const pbcopy = (data) => {
  const proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();
};

const query = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (ans) => {
      if(typeof ans !== 'string') {
        reject(ans);
      }
      resolve(ans);
    });
  });
}

let company, addr, reel, position;
query('Company Name: ')
.then((ans) => {
  company = ans;
  return query('Address: ');
})
.then((ans) => {
  if(ans.length === 0) addr = 'San Francisco, CA';
  else addr = ans;
  return query('Position: ');
})
.then((ans) => {
  if(ans.length === 0) position = 'Software Engineer';
  else position = ans;
  return query('Specifics: ');
})
.then((ans) => {
  reel = ans;
  const header = `${company}\n${addr}\n\n\nDear ${company},\n\n`;

  const body = `I am writing to express my interest in being a ${position} at ${company}. This role is exciting because it aligns with my passion for designing user experiences and problem solving. Equally appealing is the opportunity to leverage my knowledge of the web development stack and to work with equally driven individuals. ${reel} \n\n My current language of choice is Javascript along with its various components that comprise the full stack spectrum. I am comfortable using React, React Native, Redux, Node, Express, MongoDB, PostgreSQL and I also have experience with Angular, Backbone, and database ORMS. Apart from technological stack, I also value proper communication and am very receptive to feedback. People have told me that I am easy to work with because of my ability to speak on a problem, whether it’s one that I can help with or one I am struggling with myself. I find that my ability to keep an open mind and a willingness to adapt has consistently contributed to my success.\n\nThank you for your time. If you are interested in reciprocating my enthusiasm, please don’t hesitate to leave me an email at wallace.s.luk@gmail.com\n\nRegards,\n \
    Wallace`;

  pbcopy(header + body);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('cover-letter.pdf'));
  doc.fontSize(11);
  doc.font('Times-Roman');
  doc.text(header);
  doc.text(body);

  doc.end();
  rl.close();
})
.catch((err) => {
  console.log('Error', err.message);
});