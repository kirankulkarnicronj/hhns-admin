import React from 'react'
import { Switch } from 'antd'
import { Helmet } from 'react-helmet'
import AddForm from './AddForm'
import styles from './style.module.scss'

class BlogAddPost extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      language: true,
    }
  }

  handleLanguage = (checked, event) => {
    console.log('value =====>>>>>', checked, event)
    this.setState({
      language: checked,
    })
  }

  render() {
    const { language } = this.state
    return (
      <div>
        <Helmet title="Add Blog Post" />
        <section className="card">
          <div className="card-header mb-2">
            <div className="utils__title">
              <strong>Post Add/Edit</strong>
              <Switch
                defaultChecked
                checkedChildren="en"
                unCheckedChildren="ru"
                onChange={this.handleLanguage}
              />
            </div>
            {/* <div className="utils__title">
              <strong>En/Ru</strong>
              <Switch defaultChecked checkedChildren="en" unCheckedChildren="ru" onChange={this.handleLanguage} />
            </div> */}
          </div>
          <div className="card-body">
            <div className={styles.addPost}>
              <AddForm english={language} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default BlogAddPost
