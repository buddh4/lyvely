
General:

- [ ] Input Validation
- [ ] I18N [nestjs-i18n](https://github.com/ToonvanStrijp/nestjs-i18n#readme)
- [x] Multi profile

Use-cases:
 
- [x] Create activity
- [x] Update activity log
- [x] Calculate and persist score
- [ ] Categories
- [ ] Journal
- [ ] Challenges  
- [ ] Statistics

Security:

- [ ] Repeat password
- [ ] Password regex
- [x] Exclude password from toJSON
- [ ] Skip password select by default
- [ ] NoSQL Injection 
   - [MongoDB Query injection](https://docs.mongodb.com/manual/faq/fundamentals/#how-does-mongodb-address-sql-or-query-injection-)
   - [OWASP NoSQL Injection](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection)
- [ ] Remove direct git dependency to common lib + token
- [ ] Password salt config
- [ ] Field level encryption
- [ ] Https

Minor:

- [ ] Validate locale