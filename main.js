/* -*- Mode: js2; indent-tabs-mode: nil; js2-basic-offset: 2; -*- */
/* global $, Blob, saveAs, CSV, d3, JSZip, _ */
// CSV: https://github.com/knrz/CSV.js/

var data = [
  { label: 'Creator (Name)',
    id: 'creator',
    required: true,
    type: 'input',
    example: 'Zachary King' },
  { label: 'Creator Email',
    id: 'creator-email',
    required: true,
    type: 'input',
    example: 'zakandrewking@gmail.com' },
  { label: 'Project Name',
    id: 'project',
    required: true,
    type: 'input' },
  { label: 'Data Type',
    id: 'data-type',
    type: 'dropdown',
    custom: true,
    default: 'DNA-seq',
    options: ['DNA-seq', 'RNA-seq', 'ChIP-seq', 'ChIP-exo', 'Ribo-seq'] },
  { label: 'Experiment Date (YYYY-MM-DD)',
    id: 'run-date',
    required: true,
    type: 'date',
    description: 'For sequencing experiments, use the date the sample was run.'},
  { label: 'NCBI Taxonomy ID for Strain',
    id: 'taxonomy-id',
    type: 'dropdown',
    custom: true,
    required: true,
    options_function: function(callback) {
      $.getJSON('ncbi_taxon_ids.json')
        .success(function(d) { callback(Object.keys(d), d) })
        .fail(function(e) { console.log(e) })
    } },
  { label: 'Strain description',
    id: 'strain-description',
    description: ('Provide provide a full description of the strain. ' +
                  'Guidelines for describing mutations can be found ' +
                  '<a href="http://www.hgvs.org/mutnomen/recs.html" target="_blank" tabindex="-1">here</a>.'),
    required: true,
    example: 'e.g. Keio-crp, 76A>T, D111E, ΔF508, BOP8900(ΔadhE)' },
  { label: 'Growth Stage',
    id: 'growth-stage',
    example: 'mid-log' },
  { label: 'Sample Time',
    id: 'sample-time',
    type: 'time-minutes',
    description: 'Minutes from start of experiment.'},
  { label: 'Antibody',
    id: 'antibody',
    example: 'anti-CRP' },
  { label: 'Temperature',
    description: 'Temperature in Celcius',
    id: 'temperature',
    example: '37',
    form: 'ALE'},
  { label: 'Base Media',
    id: 'base-media',
    type: 'dropdown',
    required: true,
    custom: true,
    options: ['M9', 'LB'] },
  { label: 'Isolate  Type',
    id: 'isolate-type',
    type: 'dropdown',
    required: true,
    custom: true,
    options: ['clonal', 'population'] },
  { label: 'Carbon Source(s)',
    id: 'carbon-source',
    type: 'dropdown',
    multiple: true,
    custom: true,
    concentration_with_default: 2,
    options: ['Glucose', 'Fructose', 'Acetate', 'Galactose'] },
  { label: 'Nitrogen Source(s)',
    id: 'nitrogen-source',
    type: 'dropdown',
    multiple: true,
    custom: true,
    concentration_with_default: 1,
    options: ['NH4Cl', 'Glutamine', 'Glutamate'] },
  { label: 'Phosphorous Source(s)',
    id: 'phosphorous-source',
    type: 'dropdown',
    multiple: true,
    custom: true,
    concentration_with_default: 3,
    options: ['KH2PO4'] },
  { label: 'Sulfur Source(s)',
    id: 'Sulfur-source',
    type: 'dropdown',
    multiple: true,
    custom: true,
    concentration_with_default: 0.24,
    options: ['MgSO4'] },
  { label: 'Electron acceptor(s)',
    id: 'electron-acceptor',
    type: 'dropdown',
    options: ['O2', 'NO3', 'SO4'],
    concentration_with_default: 0,
    multiple: true,
    custom: true },
  { label: 'Other supplement(s)',
    id: 'supplement',
    type: 'dropdown',
    options: [],
    concentration_with_default: 1,
    multiple: true,
    custom: true },
  { label: 'Antibiotic(s) added',
    id: 'antibiotic',
    type: 'dropdown',
    custom: true,
    multiple: true,
    concentration_with_default: 1,
    options: ['Kanamycin', 'Spectinomycin', 'Streptomycin', 'Ampicillin',
              'Carbenicillin', 'Bleomycin', 'Erythromycin', 'Polymyxin B',
              'Tetracycline', 'Chloramphenicol'] },
  { label: 'Post ALE enrichment details',
    id: 'post-ALE-enrichment-details',
    form: 'ALE',
    type: 'textarea' },
  { label: 'ALE number',
    id: 'ALE-number',
    type: 'number',
    default: 1,
    min: 1,
    max: 100,
    form: 'ALE'},
  { label: 'Flask number',
    id: 'Flask-number',
    type: 'number',
    default: 1,
    min: 1,
    max: 100,
    form: 'ALE'},
  { label: 'Isolate number',
    id: 'Isolate-number',
    type: 'number',
    default: 1,
    min: 1,
    max: 100,
    form: 'ALE'},
  { label: 'Technical replicate number',
    id: 'technical-replicate-number',
    type: 'number',
    default: 1,
    min: 1,
    max: 100,
    form: 'ALE'},
  { label: 'Machine',
    id: 'machine',
    type: 'dropdown',
    custom: true,
    options: ['MiSeq', 'NextSeq', 'HiSeq'] },
  { label: 'Library Prep Kit Manufacturer',
    id: 'library-prep-kit-manufacturer',
    type: 'dropdown',
    custom: true,
    options: ['Illumina', 'Kapa'] },
  { label: 'Library Prep Kit',
    id: 'library-prep-kit',
    type: 'dropdown',
    custom: true,
    options: ['Nextera XT', 'KAPA HyperPlus', 'KAPA Stranded RNA-seq'] },
  { label: 'Library Prep Kit Cycles',
    id: 'library-prep-kit-cycles',
    type: 'dropdown',
    custom: true,
    options: ['50 Cycle', '150 Cycle', '300 Cycle', '500 Cycle', '600 Cycle'] },
  { label: 'Single- or paired-end reads',
    id: 'read-type',
    type: 'dropdown',
    options: ['Single-end reads', 'Paired-end reads'] },
  { label: 'Read Length',
    id: 'read-length',
    type: 'dropdown',
    options: ['31', '36', '50', '62', '76', '100', '151', '301'],
    custom: true },
  { label: 'Sample Preparation and Experiment Details',
    id: 'experiment-details',
    type: 'textarea' },
  { label: 'Environment',
    description: 'Describe any other environmental parameters.',
    id: 'environment',
    form: 'Generic'},
  { label: 'Biological replicates',
    id: 'biological-replicates',
    type: 'number',
    default: 1,
    min: 1,
    max: 100,
    form: 'Generic'},
  { label: 'Technical replicates',
    id: 'technical-replicates',
    type: 'number',
    default: 1,
    min: 1,
    max: 100,
    form: 'Generic'}
]

var data_as_object = {}
data.forEach(function(d) { data_as_object[d.id] = d })
var workflow = 'Generic'


$(document).ready(function(){

  // add the uploader
  create_uploaders()

  create_form('Generic')

  // submit
  $('#submit').click(function(){
    if (!check_required()) return
    var data_array = get_data_array()
    if (workflow == 'Generic') {
      save_generic_metadata(data_array)
    } else {
      save_ale_metadata(data_array)
    }
  })

  $('#download_example').click(function(){
    var output_file_name = "ale_sample_names",
        example_output = [["1","1","0","1"],["\n1","1","1","1"],["\n1","1","2","1"]],
        file = new Blob(example_output, { type: 'text/plain;charset=utf-8' })
    saveAs(file, output_file_name + '.csv')
  })

})

function create_form(form_type) {

  workflow = form_type

  var center_column = $('#center-column')

  // Remove all child elements of center-column to start with blank sheet.
  while (center_column[0].firstChild) {
    center_column[0].removeChild(center_column[0].firstChild)
  }

  // Hide/show the Optional: Ale Specific Drag and drop CSV box
  if(form_type == 'Generic') {
    document.getElementById('csv_drag_and_drop').style.display = 'none'
    document.getElementById('generic_instructions').style.display = 'block'
    document.getElementById('folder-name-panel').style.display = 'block'
  } else {
    document.getElementById('csv_drag_and_drop').style.display = 'block'
    document.getElementById('generic_instructions').style.display = 'none'
    document.getElementById('folder-name-panel').style.display = 'none'
  }

  // add the form
  for(var i = 0; i < data.length; i++) {
    // add the input
    if (data[i]['form'] == form_type || data[i]['form'] == undefined) {
      create_input(data[i], center_column, i === 0)
    }
  }
}

function get_data_array() {
  var data_array = []
  for(var i = 0; i < data.length; i++){
    var val = get_value(data[i]['id'])
    data_array.push([data[i]['id'], val])
  }
  console.log(data_array)
  return data_array
}

function check_required() {
  if ($('.required.alert-danger').length !== 0) {
    $('#submit').get(0).disabled = true
    $('#required-to-submit').show()
    return false
  } else {
    $('#submit').get(0).disabled = false
    $('#required-to-submit').hide()
    return true
  }
}

function create_uploaders() {
  $('#file-upload').fileReaderJS({
    dragClass: 'drag',
    readAsDefault: 'Text',
    on: {
      load: handle_upload
    }
  });
  $('#name-file-upload').fileReaderJS({
    dragClass: 'drag',
    readAsDefault: 'Text',
    on: {
      load: handle_name_upload
    }
  })
}

function handle_upload(e, file) {
  var csv_data = e.target.result,
      arrays = new CSV(csv_data).parse()
  for (var i = 0; i < arrays.length; i++)
    set_value(arrays[i][0], arrays[i][1])
  check_required()
}


function get_zip_name() {
  return get_value('project').toString() + '_' + folder_name()
}


function get_file_name() {
  var lib_prep = get_lib_prep_code(get_value('library-prep-kit').toString())
  if (lib_prep != '')
    lib_prep = '_' + lib_prep

  return get_value('project').toString()
    + lib_prep
    + '_'
    + get_value('ALE-number').toString()
    + '-' + get_value('Flask-number').toString()
    + '-' + get_value('Isolate-number').toString()
    + '-' + get_value('technical-replicate-number').toString()
}


const ALE_NUMBER_IDX = 0
const FLASK_NUMBER_IDX = 1
const ISOLATE_NUMBER_IDX = 2
const TECHNICAL_REPLICATE_IDX = 3

function handle_name_upload(e, file) {

  // fast fail
  if (!check_required())
    return

  var input_csv_data = e.target.result,
      variable_file_name_array = new CSV(input_csv_data).parse()

  var output_sample_name_array = []

  var zip = new JSZip()

  for (var name_idx = 0; name_idx < variable_file_name_array.length; name_idx++) {
    set_value('ALE-number', variable_file_name_array[name_idx][ALE_NUMBER_IDX])
    set_value('Flask-number', variable_file_name_array[name_idx][FLASK_NUMBER_IDX])
    set_value('Isolate-number', variable_file_name_array[name_idx][ISOLATE_NUMBER_IDX])
    set_value('technical-replicate-number',variable_file_name_array[name_idx][TECHNICAL_REPLICATE_IDX])

    var file_name = get_file_name() + '.csv'
    output_sample_name_array.push([file_name])

    var output_sample_csv_data = [new CSV(get_data_array()).encode()]
    var output_sample_metadata_file = new Blob(output_sample_csv_data, { type: 'text/plain;charset=utf-8' })
    zip.folder("samples").file(file_name, output_sample_metadata_file)
  }

  var output_sample_name_csv_data = [new CSV(output_sample_name_array, {header: ["samples"]}).encode()]
  var output_sample_name_file = new Blob(output_sample_name_csv_data, { type: 'text/plain;charset=utf-8' })
  zip.file('samples.csv', output_sample_name_file)

  zip.generateAsync({type:"blob"})
    .then(function (blob) {
      saveAs(blob, get_zip_name() + '.zip')
    })
}


function folder_name() {
  var l = ['run-date', 'data-type'].map(function(el) {
    return get_value(el).replace(' ', '').replace(/\//g, '-')
  })
  return _.every(l) ? l.join('_') : ''
}


function update_folder_name() {
  $('#folder-name').val(folder_name())
}


function get_lib_prep_code(lib_prep_kit) {
  var lib_prep_code = ''
  if (lib_prep_kit == 'Nextera XT')
    lib_prep_code = 'NXT'
  else if (lib_prep_kit == 'KAPA HyperPlus')
    lib_prep_code = 'KHP'
  else if (lib_prep_kit == 'KAPA Stranded RNA-seq')
    lib_prep_code = 'KSR'
  return lib_prep_code
}


function save_ale_metadata(array) {
  var file_name = get_file_name()
  var csv_data = [new CSV(array).encode()]
  var file = new Blob(csv_data, {type: 'text/plain;charset=utf-8'})
  saveAs(file, file_name + '.csv')
}


function save_generic_metadata(array) {
  var label = folder_name(),
    csv = [new CSV(array).encode()],
    file = new Blob(csv, {type: 'text/plain;charset=utf-8'})
  saveAs(file, label + '.csv')
}


function get_value(id, input_only) {
  /** Get the value for the given input id */

  if (_.isUndefined(input_only))
    input_only = false

  // try to get concentrations
  var concentrations = {}
  $('#' + id).parent().find('.concentration-input>input').each(function() {
    var el = $(this),
        val = $(this).val()
    if (val) concentrations[el.attr('id')] = val
  })

  // get the value
  var vals = $('#' + id).val()
  if ((typeof vals === 'undefined') || (vals === null))
    return ''

  if (input_only)
    return vals

  // add concentrations to val
  if (_.isArray(vals)) {
    return vals.map(function(val) {
      if (val in concentrations)
        return val + '(' + concentrations[val] + ')'
      else
        return val
    })
  } else {
    return vals
  }
}


function set_value(id, value) {
  if (!(id in data_as_object)) {
    console.warn('Unrecognized key ' + id)
    return
  }

  var sel = $('#' + id)

  if (sel.data('select2')) {
    var split_val = value.split(',').filter(function(x) {
      return x.replace(' ', '') !== ''
    }),
        extracted_val = extract_concentrations(split_val),
        concentrations = {}
    // for multiple selections, add the options if it doesn't exist
    var ids = [], input_val = []
    sel.find('option').each(function() {
      ids.push($(this).val())
    })
    extracted_val.forEach(function(val_obj) {
      var val = val_obj.id
      if (ids.indexOf(val) === -1)
        sel.append('<option value="' + val + '">' + val + '</option>')
      // for the input
      input_val.push(val)

      // for the concentrations
      if (val_obj.concentration)
        concentrations[val] = val_obj.concentration
    })
    sel.val(input_val).trigger('change')

    // update the concentration
    if (Object.keys(concentrations).length > 0) {
      draw_concentrations(id,
                          data_as_object[id]['concentration_with_default'],
                          concentrations)
    }
  } else if (data_as_object[id]['type'] == 'date') {
    var date = new Date(value)
    var date_str = [
      // Year in local time
      date.getFullYear(),
      // Month is given between 0-11
      date.getMonth() + 1,
      // Day is given between 0-30
      date.getDate() + 1
    ].join('-')
    sel.val(date_str).trigger('change')
  } else {
    sel.val(value).trigger('change')
  }

  // update UI
  update_required_label(id, value)
  update_folder_name()
}


function update_required_label(id, value) {
  if (value === '') {
    $('#required-alert-' + id)
      .addClass('alert-danger')
      .removeClass('alert-success')
  } else {
    $('#required-alert-' + id)
      .addClass('alert-success')
      .removeClass('alert-danger')
  }
  check_required()
}


function add_form_container(html, label, required, id, description, custom, multiple) {
  var required_str, custom_mult_str, description_str
  if (required)
    required_str = '<span id="required-alert-' + id + '" class="required alert alert-danger" role="alert">(Required)</span>'
  else
    required_str = ''

  if (custom && multiple)
    custom_mult_str = ' (Choose one or more, including custom values)'
  else if (custom)
    custom_mult_str = ' (Choose or enter a new value)'
  else if (multiple)
    custom_mult_str = ' (Choose one or more)'
  else
    custom_mult_str = ''

  if (description)
    description_str = '<div>' + description + '</div>'
  else
    description_str = ''

  return '<div class="form-group row"><div class="col-sm-6"><label>' + label + '</label>' + custom_mult_str +
    required_str + description_str +
    '</div><div class="col-sm-6">' + html + '</div></div>'
}


function add_dropdown_options(input_sel, options, options_data, def, select_options) {
  var options_html = ''
  for (var i = 0; i < options.length; i++) {
    var opt = options[i],
        selected_str = opt === def ? ' selected="selected"' : ''
    options_html += '<option value="'+ opt + '"' + selected_str + '>' + opt + '</option>'
  }

  input_sel.html(options_html)
  if (options_data) {
    select_options['templateResult'] = function(state) {
      return state.id + ': ' + options_data[state.id]
    }
    select_options['matcher'] = function (params, data) {
      // check both the 3-letter-id and the explanation text
      if ($.trim(params.term) === '' ||
          data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1 ||
          options_data[data.text].toLowerCase().indexOf(params.term.toLowerCase()) > -1) {
        return data
      }
      return null
    }
  }

  // initialize select2
  input_sel.select2(select_options)

  // to avoid the default tag
  if (!def) input_sel.val([]).trigger('change')
}


function extract_concentrations(vals) {
  /** Get the ids and concentrations from strings like "Glucose(2)" */

  var out = []
  for (var i=0, l=vals.length; i<l; i++) {
    var t = vals[i],
        res = /(.*)\(([0-9.]+)\)/.exec(t)
    if (_.isNull(res))
      out.push({ id: t, concentration: null })
    else
      out.push({ id: res[1], concentration: res[2] })
  }
  return out
}


function draw_concentrations(id, def, value_dict) {
  if (_.isUndefined(value_dict)) value_dict = {}

  var sel = d3.select(d3.select('#' + id).node().parentNode)
        .selectAll('.concentration-input')
        .data(get_value(id, true), function(d) { return d })
  var div = sel.enter()
        .append('div')
        .attr('class', 'concentration-input')
  if(id == "antibiotic")
      div.append('span').text(function(d) { return d + ' concentration (ug/mL)' })
  else
      div.append('span').text(function(d) { return d + ' concentration (g/L)' })
  div.append('input').attr('type', 'number')
    .attr('id', function(d) { return d })
    .attr('class', 'form-control')
    .attr('min', '0')
    .attr('max', '1000')
    .attr('value', function(d) {
      return (d in value_dict) ? value_dict[d] : def
    })

  sel.exit().remove()
}


function create_input(data, parent_sel, autofocus) {
  var label = data['label'],
      id = data['id'],
      required = data['required'],
      description = data['description'],
      type = data['type'],
      def = data['default'] || '',
      example = data['example'] || '',
      options = data['options'],
      options_function = data['options_function'],
      multiple = data['multiple'],
      custom = data['custom'],
      concentrations = data['concentrations'],
      min = data['min'],
      html = '',
      autofocus_str = autofocus ? ' autofocus' : '',
      after_append

  // check for some required attributes
  if (!id) console.error('No ID for ' + label)
  if (options && (type !== 'dropdown'))
    console.error('Has "options" with a type that is not "dropdown" for ' + label)
  if (min && (type !== 'number'))
    console.error('Has "min" with a type that is not "number" for ' + label)

  if (type == 'dropdown') {
    var select_options = {
      'allowClear': true,
      'placeholder': ''
    }
    // multiple selections
    if (multiple) {
      select_options['multiple'] = true
    }
    // custom options
    if (custom) {
      select_options['tags'] = true
      select_options['createTag'] = function(query) {
        return {
          id: query.term,
          text: query.term + ' (custom)',
          tag: true
        }
      }
    }
    if (!required) {

    }
    html = '<select id="' + id + '" style="width: 100%" ' + autofocus_str + '></select>'

    after_append = function() {
      // prefer options to options_function
      if (!options && options_function) {
        options_function(function(options, options_data) {
          add_dropdown_options($('#' + id), options, options_data, def, select_options)
        })
      } else {
        add_dropdown_options($('#' + id), options, null, def, select_options)
      }
      if (!_.isUndefined(data['concentration_with_default'])) {
        $('#' + id).on('change', function() {
          draw_concentrations(id, data['concentration_with_default'])
        })
      }
      // when clearing, close the menu
      $('#' + id).on('select2:unselecting', function (e) {
        $(this).select2('val', '')
        e.preventDefault()
      })
    }
  } else if (type === 'date') {
    html = '<input type="text" class="form-control" id="' + id + '" value="' + def + '"' +
      ' placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >',
    after_append = function() {
      $('#' + id).datepicker({ format: 'yyyy-mm-dd' })
    }
  } else if (type === 'textarea') {
    html = '<textarea id="' + id + '" class="form-control" value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" ></textarea>'
  } else if (type === 'number' ){
    html = '<input id="' + id + '" type="number" class="form-control" min="' + min + '"' +
      ' value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >'
    after_append = function() {
      $('#' + id).bootstrapNumber()
    }
  } else {
    html = '<input id="' + id + '" class="form-control" value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >'
  }

  // create and run
  parent_sel.append(add_form_container(html, label, required, id, description, custom, multiple))
  // toggle the required label
  $('#' + id).on('change', function() {
    update_required_label(id, this.value)
    update_folder_name()
  })
  if (after_append) after_append()
}
