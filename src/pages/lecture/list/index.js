/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { Table, DatePicker, Select } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import renderHTML from 'react-render-html'
import { Link } from 'react-router-dom'

const { Option } = Select

@connect(({ lecture }) => ({ lecture }))
class ProductsList extends React.Component {
  state = {}

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'lecture/GET_LECTURES',
      page: 1,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    if (nextProps.lecture.isDeleted) {
      dispatch({
        type: 'lecture/GET_LECTURES',
        page: 1,
      })
    }
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
      type: 'lecture/GET_LECTURES',
      page,
    })
  }

  deleteLecture = uuid => {
    const { dispatch } = this.props
    console.log('uuid====????', uuid)
    dispatch({
      type: 'lecture/DELETE_LECTURE',
      uuid,
    })
  }

  onChangeDate = date => {
    const { dispatch } = this.props
    dispatch({
      type: 'lecture/GET_LECTURES',
      page: 1,
      date: date ? date.format('YYYY-MM-DD') : null,
    })
  }

  onChangeDateSort = order => {
    const { dispatch } = this.props
    dispatch({
      type: 'lecture/GET_LECTURES',
      page: 1,
      createdDateSort: order,
    })
  }

  render() {
    const { lecture } = this.props
    const { lectures, totalLectures } = lecture
    const data = lectures
    const columns = [
      {
        title: 'Title',
        dataIndex:
          window.localStorage['app.settings.locale'] === '"ru-RU"' ? 'ru.title' : 'en.title',
        key: window.localStorage['app.settings.locale'] === '"ru-RU"' ? 'ru.title' : 'en.title',
        render: title => (title ? renderHTML(this.showing100Characters(title)) : ''),
      },
      {
        title: 'Need Translation',
        dataIndex: 'translation_required',
        key: 'translation_required',
        render: type => <span>{`${type}`}</span>,
      },
      {
        title: 'Need Translation',
        dataIndex:
          window.localStorage['app.settings.locale'] === '"ru-RU"' ? 'ru.event' : 'en.event',
        key: window.localStorage['app.settings.locale'] === '"ru-RU"' ? 'ru.event' : 'en.event',
      },
      {
        title: 'Event',
        dataIndex:
          window.localStorage['app.settings.locale'] === '"ru-RU"' ? 'ru.event' : 'en.event',
        key: window.localStorage['app.settings.locale'] === '"ru-RU"' ? 'ru.event' : 'en.event',
      },
      {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: 'Date',
        dataIndex: 'created_date',
        key: 'created_date',
        render: date => <span>{`${new Date(date).toDateString()}`}</span>,
      },
      {
        title: 'Action',
        key: 'action',
        render: record => (
          <span>
            <Link to={{ pathname: '/lecture/create', state: record.uuid }}>
              <i className="fa fa-edit mr-2" />
            </Link>
            <i
              className="fa fa-trash mr-2"
              onClick={() => {
                this.deleteLecture(record.uuid)
              }}
            />
          </span>
        ),
      },
    ]

    return (
      <div>
        <Helmet title="Lecture List" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Lecture List</strong>
            </div>
            <DatePicker onChange={this.onChangeDate} />
            <Select
              id="product-edit-colors"
              showSearch
              style={{ width: '20%' }}
              onChange={this.onChangeDateSort}
              placeholder="Select Order"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="asc">Ascending</Option>
              <Option value="desc">Descending</Option>
            </Select>
            ,
          </div>
          <div className="card-body">
            <Table
              // eslint-disable-next-line no-unused-expressions
              rowClassName={record =>
                record.translation_required === true ? 'NotTranslated' : 'translated'
              }
              className="utils__scrollTable"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={data}
              pagination={{
                pageSize: 20,
                onChange: this.handlePageChnage,
                total: totalLectures,
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default ProductsList
