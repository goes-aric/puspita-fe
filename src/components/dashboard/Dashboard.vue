<template>
  <div>
    <div class="breadcrumb">
      <h1 class="text-2xl">Dashboard</h1>
    </div>
    <!-- FORM SECTION -->
    <div class="p-6 rounded-sm bg-white shadow-lg transition duration-150 ease-in">
      <div class="mb-4 p-4 border border-gray-100">
        <h3 class="block uppercase text-gray-600 mb-2">Pendapatan Parkir</h3>
        <h1 class="block text-4xl text-gray-900 mb-2">Rp. {{ formatNumber(toFixed(grandTotal, 0)) }}</h1>
        <span class="block text-gray-600 mb-2">Period Tahun {{ periodeTahun }}</span>
      </div>
      <div class="mb-4 p-4 border border-gray-100">
        <highcharts :options="chartOptions" ref="performanceCharts"></highcharts>
      </div>
    </div>
  </div>
</template>

<script>
import format from '@/helpers/formatNumber'
import {Chart} from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import exportingData from 'highcharts/modules/export-data'
import aplusanServices from '@/services/aplusan/aplusanServices'

exportingInit(Highcharts)
exportingData(Highcharts)

export default {
  name: 'DashboardPage',
  components: {
    highcharts: Chart,
  },  
  data() {
    return {
      reportData: [],
      grandTotal: '',
      periodeTahun: '',
      chartData: [],
      chartOptions: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Pendapatan Parkir'
        },
        subtitle: {
          text: 'Sumber: Data Pendapatan Parkir'
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nop', 'Des']
        },
        yAxis: {
          title: {
            text: 'Jumlah Pendapatan'
          },
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          useHTML: true,
          formatter: function () {
            return ['<h5><b>Bulan : ' + this.x + '</b></h5><br>'].concat(
              this.points ? this.points.map(function (point) {
                return '<span>Rp. ' + point.y + '</span><br>'              
              }) : []
            )
          }          
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y}'
            }
          }
        },      
        series: []      
      },      
    }
  },
  methods: {
    formatNumber(num) {
      let result = format.formatNumber(num)
      return result
    },
    unformatNumber(num) {
      let result = format.unformatNumber(num)
      return result
    },
    toFixed(num, digit) {
      let result = format.toFixed(num, digit)
      return result
    },    
    async fetchData() {
      try {
        this.isLoading = true
        const response = await aplusanServices.charts()
        if (response.data.status === 'success') {
          this.isLoading =false

          /* EMPTY ERRORS VARIABLE */
          this.error = []        

          const records = response.data.data
          this.reportData = records
          this.grandTotal = 0

          this.chartData = []
          records.forEach(element => {
            let data = []
            element.data.forEach(item => {
              data.push({
                'y': parseFloat(item.amount)
              })

              this.grandTotal += parseFloat(item.amount)
            })

            this.chartData.push({
              name: element.name,
              marker: {
                symbol: 'square'
              },
              data: data
            })
            this.periodeTahun = element.name
          })

          this.chartOptions.series = this.chartData
        } else {
          this.isLoading =false

          /* EMPTY ERRORS VARIABLE */
          this.error = []

          /* STORE RESPONSE MESSAGE TO A VARIABLE */
          let responseReturn = response.data.message

          /* ELSE, THROW ERROR MESSAGES */
          this.$toasted.error(responseReturn, this.toastedOptions) 
        }
      } catch (error) {
        this.isLoading =false
        console.log(error)
      }
    },    
  },
  mounted() {
    this.fetchData()
  }
}
</script>