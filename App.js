import React from 'react';
import { StyleSheet, Text, View, FlatList, Platform, Image, ActivityIndicator } from 'react-native';
import _ from 'lodash'
import { TextInput } from 'react-native-gesture-handler'; 
import axios from 'axios'
axios.defaults.baseURL = 'https://newsapi.org/v2'
axios.defaults.headers.common['Authorization'] = 'Bearer ebb279c9a1524095af6f6a1f514b5f0b'


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '', refresh: true, news: [], isVisible: false, isEmpty: true }
    this.getNews = async news => {
      try {
        const response = await axios.get('/everything', { params: { q: news, language: 'en' } })
        if(response && response.status === 200) {
          const data = response.data
          this.setNews(data.articles)
        }
        console.log('something error')
      } catch (error) {
      }
    }
    this.newsForm = news => {
      this.debouncer(news)
      this.setState({text: news})
    }
    this.setNews = news => {
      this.setState({news: news})
    }
    this.getNewsAPI = (news) => {
      this.getNews(news)
      this.setState({refresh: !this.state.refresh})
    }
    this.debouncer = _.debounce(this.getNewsAPI, 500)
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{padding: 5, backgroundColor: '#34495E'}}>
          <TextInput value={this.state.text} style={{height: 40, borderColor: '#eee', backgroundColor: '#fff', borderWidth: 1, paddingLeft: 5, paddingTop: 4, paddingRight: 5, paddingBottom: 4}} onChangeText={this.newsForm} placeholder="search a news here" />
        </View>
        <View style={{ padding: 5 }} isVisible={!this.state.isVisible}>
          <FlatList data={this.state.news} keyExtractor={(item, index) => index.toString()} extraData={this.state.refresh} renderItem={({item})=> <View style={{flex: 1, borderColor: '#eee', borderWidth: 1, margin: 5, padding: 5}}>
            <Text> {item.title} </Text>
            <Image style={{ width: null, height: 100 }} source={{ uri: item.urlToImage }}/>
          </View> }  />
        </View>
        <View isVisible={this.state.isVisible || this.state.isEmpty}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    flexDirection: "column",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});
