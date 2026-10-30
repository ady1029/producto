

const handlerError = (error, setErrors, alert, message) => {


    if (error.response.data.status === 400) {

        let errors = {}
        error.response.data.errors.forEach(item => {

            let fields = item.fields.split(", ")

            fields.forEach(field => {
                errors[field] = item.message;
            })

        })

        setErrors(errors);
        alert.show(error.response.data.message, { type: 'warning', });

    } else
        alert.error(message);


}

export default handlerError