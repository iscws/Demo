const phone = [15521188867, 13144089704, 13066252878, 15888179280, 12323];
const phoneRe = /^1[3456789]\d{9}/g;
console.log(phoneRe.test("1552118886713144089704"));
const phonefilter = phone.filter((phonenumber) => phoneRe.test(phonenumber));
console.log(phonefilter);
