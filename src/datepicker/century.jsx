var React = require('react/addons')
  , cx = React.addons.classSet
  , dates = require('../util/dates')
  , chunk = require('../util/chunk')
  , _ = require('lodash')


module.exports = React.createClass({

  propTypes: {
    value:         React.PropTypes.instanceOf(Date),
    min:          React.PropTypes.instanceOf(Date),
    max:          React.PropTypes.instanceOf(Date),

    onChange:     React.PropTypes.func.isRequired
  },

  render: function(){
    var years = getCenturyDecades(this.props.value)
      , rows  = chunk(years, 4);

    return (
      <table tabIndex='0' role='grid' className='rw-calendar-grid rw-nav-view'>
        <tbody onKeyUp={this._keyUp}>
          { _.map(rows, this._row)}
        </tbody>
      </table>
    )
  },

  _row: function(row){
    return (
      <tr>
      {_.map(row, date => {
        return !inRange(date, this.props.min, this.props.max) 
          ? <td className='rw-empty-cell'>&nbsp;</td>
          : (<td className={cx({ 'rw-off-range': !inCentury(date, this.props.value) })}>
              <btn onClick={_.partial(this.props.onChange, date)}>
                { label(date) }
              </btn>
            </td>)
      })}
    </tr>)
  },

  _onClick: function(date, idx){
    console.log(date, idx)
  },


});

function label(date){
  return dates.format(dates.firstOfDecade(date),     dates.formats.YEAR) 
    + ' - ' + dates.format(dates.lastOfDecade(date), dates.formats.YEAR)
}

function inRange(decade, min, max){
  return dates.gte(decade, dates.firstOfDecade(min), 'year') 
      && dates.lte(decade, dates.lastOfDecade(max),  'year')
}

function inCentury(date, start){
  return dates.gte(date, dates.firstOfCentury(start), 'year') 
      && dates.lte(date, dates.lastOfCentury(start),  'year')
}

function getCenturyDecades(date){
  var date = dates.add(dates.firstOfCentury(date), -20, 'year')

  return _.map(_.range(12), function(i){
    return date = dates.add(date, 10, 'year')
  })
}

var btn = require('../common/btn.jsx')