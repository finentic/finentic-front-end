import React from 'react'
import { updateName } from '../../api'
import { Form } from 'react-bootstrap'


class Name extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editNameElement: false,
            accountName: this.props.accountName,
            newName: this.props.accountName
        }
    }

    handleNameSubmit = async event => {
        try {
            event.preventDefault()
            await updateName({
                account_address: this.props._id,
                name: this.state.newName,
            })
            this.setState({ accountName: this.state.newName })
            this.hideEditNameElement()
        } catch (error) {
            console.error(error)
        }
    }

    handleNameChange = event => {
        this.setState({ newName: event.target.value })
    }

    showEditNameElement = () => {
        this.setState({ editNameElement: true })
    }

    hideEditNameElement = () => {
        this.setState({ editNameElement: false })
    }

    render() {
        return (
            <>
                <label
                    className={this.state.editNameElement ? 'd-none' : 'd-block'}
                    htmlFor="accountName">
                    <h2 onClick={this.showEditNameElement}>
                        {this.state.accountName}
                    </h2>
                </label>
                {this.state.editNameElement ? (
                    <form className={this.state.editNameElement ? 'd-block' : 'd-none'} onSubmit={this.handleNameSubmit}>
                        <Form.Control
                            type='text'
                            className='form-control my-1'
                            name='accountName'
                            id='accountName'
                            maxLength='32'
                            onBlur={this.hideEditNameElement}
                            onChange={this.handleNameChange}
                            value={this.state.newName}
                            required
                        />
                    </form>
                ) : null}
            </>
        )
    }
}

export default Name