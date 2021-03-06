$(document).ready(function () {
  // Hide Search
  $(document).on('preInit.dt', function (e, settings) {
    $('#data-table_filter').hide();
  });

  var groupColumn = 1; // Grouping Ward

  var table = $('#data-table').DataTable({
    ajax: {
      url: 'https://spreadsheets.google.com/feeds/list/1O3v5jAmt_8JUyyK2NT_h33bFraTcYPHjmtD5Lkuk6VE/od6/public/values?alt=json',
      dataSrc: 'feed.entry',
    },
    searching: true, // Enable Search
    // scrollY: '70vh', // Scrollable table fixed top - display vertical height
    // scrollCollapse: true, // Scrollable table fixed top
    paging: false, // Remove Paging
    fixedHeader: true, // Sticky Header
    ordering: true,
    info: false, // Remove info "Data Page 1 of 100"
    autoWidth: false,
    columns: [
      {
        data: 'gsx$srno.$t',
        searchable: false,
        // className: "text-center col-1",
        orderable: false,
        visible: false,
      },
      {
        data: 'gsx$ward.$t',
        searchable: false,
      },
      {
        data: 'gsx$location.$t',
        searchable: true,
        className: 'col',
        orderable: false,
      },
      {
        data: 'gsx$nameofactivevaccinationcentre.$t',
        searchable: true,
        className: 'col',
        orderable: false,
      },
      {
        data: 'gsx$facilitycategory.$t',
        searchable: false,
        className: 'col-lg-1 text-center',
        orderable: false,
      },
      {
        data: 'gsx$functionalondate.$t',
        searchable: false,
        className: 'col-lg-1 text-center status',
        orderable: false,
      },
      {
        data: 'gsx$covaxincovishield.$t',
        searchable: false,
        className: 'col-lg-1',
        orderable: false,
        render: function (data, type, row) {
          return '<span class="vaccine-text">' + data + '</span>';
        },
      },
      {
        data: 'gsx$remarks.$t',
        searchable: false,
        className: 'col',
        orderable: false,
      },
    ],

    // Grouping Ward Starts //
    columnDefs: [
      {
        visible: false,
        targets: groupColumn,
      },
    ],
    // order: [[groupColumn, 'asc']],

    rowGroup: {
      dataSrc: 'gsx$ward.$t',
      className: 'group text-center',
      emptyDataGroup: null,
      endRender: null,
      startRender: function (rows, group) {
        var count = 0;
        rows.every(function () {
          if (!$(this.node()).hasClass('d-none')) {
            count++;
          }
        });
        return count === 0 ? $('<tr hidden />') : $('<tr/>').append('<td colspan="6">Ward <span class="ward-name">' + group + '</span></td>');
      },
    },
    // Grouping Ward Ends //

    // Search Start //

    initComplete: function () {
      $('#data-table_filter').detach().appendTo('#search-area');

      $('#data-table_filter').show();
    },
    language: {
      search: '',
      searchPlaceholder: 'Search Location or Center Name...',
      emptyTable: 'No Data Available',
      zeroRecords: 'No Data Available.',
    },

    // Search End //

    // Not Available = Yes, No, EMPTY, 18-44
    createdRow: function (row, data, dataIndex) {
      if (data.gsx$functionalondate.$t === 'No') {
        $(row).addClass('text-muted status-no d-none');
      }
      if (data.gsx$functionalondate.$t === 'Stock Exhausted') {
        $(row).addClass('status-exhausted');
      }

      if (data.gsx$functionalondate.$t === '') {
        $(row).addClass('d-none');
      }
      if (data.gsx$agegroup.$t === '18+') {
        $(row).addClass('status-age18');
      }

      // Covishield, Covaxin and Both
      if (data.gsx$covaxincovishield.$t === 'Covishield') {
        $('td', row).eq(4).addClass('vaccine-covishield');
      }
      if (data.gsx$covaxincovishield.$t === 'Covaxin') {
        $('td', row).eq(4).addClass('vaccine-covaxin');
      }
      if (data.gsx$covaxincovishield.$t === 'Both') {
        $('td', row).eq(4).addClass('vaccine-both');
      }
    },
  });
});

// Location change of Search input

$(document).ready(function () {
  $('#data-table').dataTable();
  $('#data-table_filter input').removeClass('form-control-sm');
});

// Information Gathering from Google Sheet - Start

// ID of the Google Spreadsheet
var spreadsheetID = '1O3v5jAmt_8JUyyK2NT_h33bFraTcYPHjmtD5Lkuk6VE';

// Google Sheets - URL
var surl = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/2/public/values?alt=json';

$.getJSON(surl, function (data) {
  var sentry = data.feed.entry;

  $(sentry).each(function () {
    var todays_date = document.getElementById('todays-date');
    if (this.gsx$todaysdate.$t !== '') {
      todays_date.innerHTML = this.gsx$todaysdate.$t;
    }

    var last_updated_date = document.getElementById('last-updated-date');
    if (this.gsx$lastupdated.$t !== '') {
      last_updated_date.innerHTML = 'Last Updated: ' + this.gsx$lastupdated.$t;
    }

    var centers_functional_status = document.getElementById('centers-functional-status');

    //centers_functional_status.innerHTML = this.gsx$centersfunctionalstatus.$t;

    centers_functional_status.innerHTML += '<ul class="centers-details"><li class="centers-details-item">' + this.gsx$centersfunctionalstatus.$t + '</li></ul>';

    var source_details = document.getElementById('source-details');

    if (this.gsx$source.$t !== '') {
      source_details.innerHTML = '<a class="nav-link" href="' + this.gsx$source.$t + '" target="_blank">Source</a>';
    }
    if (this.gsx$update1.$t !== '') {
      source_details.innerHTML += '<a class="nav-link" href="' + this.gsx$update1.$t + '" target="_blank">Update 1</a>';
    }
    if (this.gsx$update2.$t !== '') {
      source_details.innerHTML += '<a class="nav-link" href="' + this.gsx$update2.$t + '" target="_blank">Update 2</a>';
    }
    if (this.gsx$update3.$t !== '') {
      source_details.innerHTML += '<a class="nav-link" href="' + this.gsx$update3.$t + '" target="_blank">Update 3</a>';
    }
  });
});

// Information Gathering from Google Sheet - End

//check
