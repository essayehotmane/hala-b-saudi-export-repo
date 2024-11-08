import React, {useEffect, useState} from "react";
import {StyleSheet, ScrollView, View, ActivityIndicator, Text} from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import HistoryLineItem from "../components/HistoryLineItem";
import LoadMore from "../components/LoadMore";
import HistoryModal from "../components/HistoryModal";
import {useRoute} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {fetchDiscounts} from "../features/discount/discountSlice";
import {RootState} from "../slices/store";
import formatDate from "../utils/formatDate";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import {
  fetchTranslations,
  loadingLanguage,
  selectLanguage,
  selectTranslations, setLanguage
} from "../features/translation/translationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryDetails = () => {
  const route = useRoute();
  const userId = route.params?.userId;
  const token = route.params?.token;
  const { loading } = useSelector(
      (state: RootState) => state.discount
  );

  const [isVisible, setIsVisible] = useState(false);
  const [discounts, setDiscounts] = useState([]);

  const [selectedService, setSelectedService] = useState([]);
  const handleShowModal = (_row: any) => {
    setSelectedService(_row);
    setIsVisible(true);
  };

  const dispatch = useDispatch();

  const language = useSelector(selectLanguage);
  const languageLoading = useSelector(loadingLanguage);
  const translations = useSelector(selectTranslations);

  useEffect(() => {
    // Fetch translations when the component mounts
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        console.log('savedLanguage ? ', savedLanguage)
        if (savedLanguage) {
          dispatch(setLanguage(savedLanguage));
        }else{
          dispatch(setLanguage('en')); // if there is any language in AS set 'en'
        }
      } catch (error) {
        console.error("Failed to load language", error);
      }
    };

    loadLanguage();
  }, [dispatch]);

  useEffect(() => {
    if (language) {
      console.log('loaded language ? ', language)
      dispatch(fetchTranslations(language));
    }
  }, [language, dispatch]);


  const t = (key: string) => translations[key] || key;

  useEffect(() => {
    const getDiscounts = async () => {
      try {
        const discounts = await dispatch(fetchDiscounts({userId: userId, token: token})).unwrap();
        if (discounts && !loading){
          setDiscounts(discounts);
        }
      } catch (error) {
        console.error("Error issuing token or fetching discounts:", error);
      }
    };

    getDiscounts();
  }, [dispatch]);

  if (loading || languageLoading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00502A" />
        </View>
    );
  }

  // Check if there are no history and display a message
  if (!loading && discounts.length === 0) {
    return (
        <View style={styles.container}>
          <HeaderLogo isRtl={(language === 'ar')} pageTitle={capitalizeFirstLetter(t('history'))} />
          <Text style={styles.noDataText}>{capitalizeFirstLetter(t('no_history_available'))}</Text>
        </View>
    );
  }

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <HistoryModal
            visible={isVisible}
            title={capitalizeFirstLetter(t('you_got'))}
            serviceName={capitalizeFirstLetter(selectedService.service?.name)}
            date={formatDate(selectedService.updated_at)}
            discount={selectedService.value}
            onClose={() => {
              setIsVisible(false);
            }}
        />
        <HeaderLogo isRtl={(language === 'ar')} pageTitle={capitalizeFirstLetter(t('history'))} />

        {discounts.map((_row) => (
            <HistoryLineItem
                key={_row.id}
                serviceName={capitalizeFirstLetter(_row.service.name)}
                date={formatDate(_row.updated_at)}
                onClick={() => handleShowModal(_row)}
                buttonText={capitalizeFirstLetter(t('see_details'))}
            />
        ))}

        <LoadMore onClick={() => {}} />
      </ScrollView>
  );
};

export default HistoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'white'
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listElement: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  listElementLeftSide: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  listElementRightSide: {
    flex: 1,
  },
  textElement: {
    fontSize: 18,
    marginLeft: 10,
    color: "#2C2C2C",
    fontWeight: "600",
  },
  loadMoreContainer: {
    width: "100%",
    alignContent: "center",
  },
  noDataText: {
    fontSize: 14,
    color: "#A4A3A3",
    textAlign: "center",
    marginTop: 20,
  },
  loadMore: {},
});
