
const slNICRegExp = /^(?:19|20)?\d{2}[0-9]{10}|[0-9]{9}[x|X|v|V]$/;
let contacNum = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
export function validateConfirmationDialog(values) {
    let errors = {};
    if (!values.reason) {
        errors.reason = 'Reason is required';
    }

    return errors;
}

export function validateConfirmationDialogNoValidation(values) {
    let errors = {};

    return errors;
}

export function validateLogin(values) {
    let errors = {};

    if (!values.username) {
        errors.username = 'Username is Required';
    }
    if (!values.password) {
        errors.password = "Password is Required"
    }
    return errors;
}

export function validateSignUp(values) {
    let errors = {};

    if (!values.username) {
        errors.username = 'Username is Required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.userEmail) {
        errors.userEmail = "Email is required";
    } else if (!emailRegex.test(values.userEmail)) {
        errors.userEmail = "Invalid email format";
    } else {
        // Additional conditions to reject specific email addresses
        const rejectedEmails = ["example@rejected.com", "another@rejected.com"];
        if (rejectedEmails.includes(values.userEmail)) {
            errors.userEmail = "This email address is not allowed";
        }
    }
    if (!values.password) {
        errors.password = "Password is Required"
    }
    return errors;
}

export function validateTaskSetting(values) {
    let errors = {};

    if (!values.name) {
        errors.name = " First Name is Required"
    }
    if (!values.address) {
        errors.address = "Address is Required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
        errors.email = "Invalid email format";
    } else {
        // Additional conditions to reject specific email addresses
        const rejectedEmails = ["example@rejected.com", "another@rejected.com"];
        if (rejectedEmails.includes(values.email)) {
            errors.email = "This email address is not allowed";
        }
    }
    if (!values.phoneNumber) {
        errors.phoneNumber = 'Contact No is required';
    } else if (!/^([+]\d{2})?\d{10}$/.test(values.phoneNumber)) {
        errors.phoneNumber = 'Contact No is not valid';
    }

    return errors;

}


export function validateTask(values) {
    console.log(values)
    let errors = {};

    if (!values.taskName) {
        errors.taskName = "Task Name is Required"
    }
    if (!values.category) {
        errors.category = "Category is Required"
    }
    if (!values.startDate) {
        errors.startDate = "Start Date is Required"
    }
    if (!values.startTime) {
        errors.startTime = "Start Time is Required"
    }
    if (!values.endDate) {
        errors.endDate = "End Date is Required"
    }
    if (!values.endTime) {
        errors.endTime = "End Time is Required"
    }
    if (!values.description) {
        errors.description = "Description is Required"
    }
    if (!values.status) {
        errors.status = "Status is Required"
    }

    return errors;
}

export function validateEvent(values) {
    console.log(values)
    let errors = {};

    if (!values.title) {
        errors.title = "Title is Required"
    }
    if (!values.start) {
        errors.start = "Start Date is Required"
    }
    if (!values.end) {
        errors.end = "End Date is Required"
    }
    if (!values.status) {
        errors.status = "Status is Required"
    }
    if (!values.color) {
        errors.color = "Color is Required"
    }
    if (!values.description) {
        errors.description = "Description is Required"
    }

    return errors;
}

export function validateTaskPasswordSettings(values) {
    console.log(values)
    let errors = {};


    if (!values.newPassword) {
        errors.newPassword = "Please enter new password"
    }
    if (!values.confirmPassword) {
        errors.confirmPassword = "Please enter current password"
    } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Password does not match"
    }
    return errors;
}
