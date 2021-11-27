const randomize = require('randomatic');
const {User} = require('../db/schemas/user-schema');


class UserControllers {

    /*
    Registration form for new users
     */
    showRegistrationPage(req, res) {
        res.render('user/registration')
    }

    /*
    Registration logic
    If the two passwords supplied are not identical, it will render the same view again with error description
    After successful login I set a req.session with a user email. On this basis, I define in the application whether the user has access to content targeted only at logged in users. The session lasts for 60 minutes (app.js file).
    In "mainMiddleware" I always forwards the session to all endpoints in the application.
    in "is-auth" I'm checking if the session exists. If not, the user will be redirected to the home page when he try to make inquiries to forbidden addresses.
    The session is deleted in the case of logging out, changing the password and changing the e-mail address.
     */
    async registration(req, res) {
        try {
            if (req.body.password1 !== req.body.password2) {
                res.render('user/registration', {message: 'Password are not the same'})
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password1
                })
                await newUser.save()
                req.session.user = req.body.email
                res.redirect('/')
            }
        } catch (err) {
            res.render('user/registration', {error: err.errors})

        }
    }

    /*
    Show login form
     */
    showLoginPage(req, res) {
        res.render('user/login')
    }

    /*
    User login
    1.I'm looking for a user by email address
    2.I check if the login and password are correct, if not, we pass to catch instruction.
     */
    async login(req, res) {

        try {
            const user = await User.findOne({email: req.body.email})
            const isPasswordValid = user.comparePassword(req.body.password)
            if (!user) {
                throw new Error('User dont exist')
            }
            if (!isPasswordValid) {
                throw new Error('Invalid password')
            }
            req.session.user = req.body.email;
            res.redirect('/')


        } catch (err) {
            res.render('user/login', {error: 'Invalid user or password'})
        }
    }

    /*
    The session is deleted
     */
    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    /*
    Shows user profile
     */
    async showProfile(req, res) {
        try {
            const user = await User.findOne({email: req.session.user}).lean()
            res.render('user/profile', {user})
        } catch (err) {
            console.log(err)
            res.render('others/error', {error: 'User not found.'})
        }

    }

    /*
    shows user profile edit form
     */
    async showEditProfile(req, res) {
        try {
            const {id} = req.params
            const user = await User.findById(id).lean()
            res.render('user/editProfile', {user})

        } catch (err) {
            console.log(err)
            res.render('others/error', {error: "Profile not found"})
        }
    }

    /*
    Save changes on user profile
     */
    async editProfile(req, res) {
        try {
            const {id} = req.params
            const user = await User.findById(id)
            user.name = req.body.name
            user.phone = req.body.phone
            user.notes = req.body.notes
            if (user.email !== req.body.email) {
                user.email = req.body.email
                user.save()
                req.session.destroy()
                res.redirect('/')
            } else {
                user.save()
                res.redirect('/admin/profile');
            }

        } catch (err) {
            console.log(err)
            res.render('others/error', {error: "Profile not found"})
        }
    }

    /*
    Shows user password page
     */
    async showPasswordPage(req, res) {
        const {id} = req.params
        const user = await User.findById(id)
        const userID = user._id
        res.render('user/changePassword', {userID})
    }

    /*
    Password change logic
    The operation will be aborted when:
    1. The new password is the same as the old one - isOldPassword
    2. The wrong current password will be given - is PasswordValid
    3. If the new password is not exactly repeated
    I use a comparePassword method, declared in user schema.
     */
    async changePassword(req, res) {
        const {id} = req.params
        try {
            const user = await User.findById(id)
            const isOldPassword = user.comparePassword(req.body.newPassword)
            const isPasswordValid = user.comparePassword(req.body.password)
            if (!isPasswordValid) {
                res.render('user/changePassword', {message: 'Current password incorrect'})
            } else if (isOldPassword) {
                res.render('user/changePassword', {message: 'The new password is the same as the old password'})
            } else if (req.body.newPassword !== req.body.newPassword2) {
                res.render('user/changePassword', {message: 'The new passwords are not the same'})
            } else {
                user.password = req.body.newPassword
                await user.save()
                req.session.destroy()
                res.render('others/info', {message: "Password has been changed. Please log in again.", layout: "info"})
            }

        } catch (err) {
            console.log(err)
            res.render('user/changePassword', {errors: err.errors})
        }
    }

    /*
    Password reset logic
    I use randomize npm package to generate an eight-character random password.
    This password will be assigned as the user's password, and he will be informed of the new password. Thanks to it, he can log into his account again and change the password there
     */
    async resetPassword(req, res) {
        const {id} = req.params
        try {
            const user = await User.findById(id)
            user.password = randomize('aA0', 8)
            user.save()
            req.session.destroy()
            res.render('others/info', {
                message: `Your new password is: ${user.password}. Please log in again.`,
                layout: 'info'
            })
        } catch (err) {
            console.log(err)
            res.render('others/error')
        }
    }

    /*
    Shows confirm page to user delete
     */
    async deleteConfirm(req, res) {
        const {id} = req.params
        try {
            const user = await User.findById(id).lean()
            res.render('user/delete', {user})
        } catch (err) {
            console.log(err)
            res.render('others/error', {error: "Unexptected error. Please try again."})
        }

    }

    /*
    User delete logic
    The user and the session is deleted.
    Render a 'info view'
     */
    async deleteUser(req, res) {
        const {id} = req.params;
        try {
            await User.findByIdAndDelete(id);
            req.session.destroy();
            res.render('others/info', {message: 'Your account has been deleted.', layout: 'info'});
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }

}


module.exports = new UserControllers()