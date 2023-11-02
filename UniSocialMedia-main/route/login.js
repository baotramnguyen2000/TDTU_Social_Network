const express = require('express')
const router = express.Router()
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const loginValidator = require('./validators/loginValidator')
const registerValidator = require('./validators/registerValidator')
const { session } = require('passport')

const User = require('../models/User')

router.get('/', (req, res) => {
    res.render('login')
})
router.get('/register', (req, res) => {
    res.render('falcutysignup',{name: '', email: '', password: ''})
})
router.post('/', loginValidator, (req, res) => {
    let result = validationResult(req)
    let errors = []
    if(result.errors.length === 0) {
        let {email, password} = req.body
        let user = undefined
        let role = undefined

        User.findOne({email: email})
        .then(u => {
            if(!u) {
                errors.push({ msg: 'Email không tồn tại'})
            }
            role = u.role
            user = u
            return bcrypt.compare(password, u.password)
        })
        .then(passwordMatch => {
            if(!passwordMatch) {
                errors.push({ msg: 'Mật khẩu không đúng'})
                return res.render('login',{errors: errors})
            }
            req.session._id = user._id
            req.session.role = user.role
            req.session.name = user.name
            console.log(req.session.email)
            res.redirect('/dashboard')
        })
        .catch(e => {
            return res.render('login',{errors: 'Đăng nhập thất bại' + e.message})
        })
    }else {
        let messages = result.mapped()
        let message = ''
        for(m in messages) {
            message = messages[m].msg
            break
        }
        errors.push({ msg: message})
        return res.render('login',{errors: errors})
    }
})
router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req)
    let errors = []
    let {email, password, name, role, falcuty} = req.body
    if(!falcuty) {
        errors.push({msg: 'Chọn ít nhất 1 phòng khoa'})
        return res.render('falcutysignup',({errors: errors, name: name, email: email, password: password}))
    }
    else if(!role) {
        errors.push({msg: 'Role là bắt buột'})
        return res.render('falcutysignup',({errors: errors, name: name, email: email, password: password}))
    }
    tempfalcuty = falcuty.toString()
    console.log(tempfalcuty)
    if (result.errors.length === 0) {
        User.findOne({email: email})
        .then(acc => {
            if (acc) {
                errors.push({msg: 'Tài khoản này đã tồn tại'})
                return res.render('falcutysignup',{errors: errors, name: name, email: email, password: password})
            }
        })
        .then(() => bcrypt.hash(password, 10))
        .then(hashed => {

            let user = new User({
                email: email,
                password: hashed,
                name: name,
                falcuty: tempfalcuty,
                role: role
            })
            req.session._id = user._id
            req.session.role = user.role
            req.session.name = user.name
            return user.save();
        })
        .then(() => {
            // không cần trả về chi tiết tài khoản nữa
            //console.log('OKEEE')
            return res.render('falcutysignup',{success: 'ok', name: '', email: '', password: ''})
        })
        .catch(e => {
            errors.push({msg: 'Đăng ký tài khoản thất bại: ' + e.message})
            return res.render('falcutysignup',{errors: errors, name: name, email: email, password: password})
        })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m].msg
            break
        }
        errors.push({msg: message})
        res.render('falcutysignup',{errors: errors, name: name, email: email, password: password})
    }
})
router.get('/logout', (req, res) => {
    req.session.destroy
    return res.redirect('/login')
})
module.exports = router