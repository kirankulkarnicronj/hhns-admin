import React from 'react'
import { Table, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import renderHTML from 'react-render-html'

@connect(({ blog }) => ({ blog }))
class BlogList extends React.Component {
  state = {}

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'blog/GET_LIST',
      page: 1,
    })
  }

  showing100Characters = sentence => {
    let result = sentence
    let resultArray = result.split(' ')
    if (resultArray.length > 10) {
      resultArray = resultArray.slice(0, 10)
      result = `${resultArray.join(' ')}...`
    }
    return result
  }

  handlePageChnage = page => {
    const { dispatch } = this.props

    dispatch({
      type: 'blog/GET_LIST',
      page,
    })
  }

  render() {
    const { blog } = this.props
    const { blogs, totalBlogs } = blog
    const data = blogs

    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        render: text => (
          <a className="utils__link--underlined" href="javascript: void(0);">
            {`#${text}`}
          </a>
        ),
      },

      {
        title: 'Title',
        dataIndex: 'title_en',
        key: 'title_en',
        render: title => (title ? renderHTML(this.showing100Characters(title)) : ''),
      },
      {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: 'Audio',
        dataIndex: 'audio_files',
        key: 'audio_files',
        render: text => (text ? <span>{`${text}`}</span> : ''),
      },
      {
        title: 'Descriptions',
        dataIndex: 'body_en',
        key: 'body_en',
        render: body => (body ? renderHTML(this.showing100Characters(body)) : ''),
      },
      {
        title: 'Needs Translation',
        dataIndex: 'needs_translation',
        key: 'needs_translation',
        render: type => <span>{`${type}`}</span>,
      },
      {
        title: 'Action',
        key: 'action',
        render: () => (
          <span>
            <Button icon="edit" className="mr-1" size="small">
              View
            </Button>
            <Button icon="cross" size="small">
              Remove
            </Button>
          </span>
        ),
      },
    ]

    return (
      <div>
        <Helmet title="Products List" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Blog List</strong>
            </div>
          </div>
          <div className="card-body">
            <Table
              className="utils__scrollTable"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={data}
              pagination={{
                pageSize: 20,
                onChange: this.handlePageChnage,
                total: totalBlogs,
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default BlogList