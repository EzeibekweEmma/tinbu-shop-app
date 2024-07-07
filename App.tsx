import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(2);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isOpaque, setIsOpaque] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpaque((prev) => !prev);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = Dimensions.get('window').width;
      const cardWidth = 180;

      const columns = Math.floor(screenWidth / cardWidth);
      setNumColumns(columns);
    };

    updateColumns();

    const subscription = Dimensions.addEventListener('change', updateColumns);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(Constants.expoConfig?.extra?.apiUrl || '');
      const result = await response.json();
      setData(result.items);
    } catch (error) {
      alert(`Something went wrong!\n\n${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuantity = (itemId: string | number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleMinusQuantity = (itemId: string | number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  const handleToggleFavorite = (itemId: any) => {
    setFavorites((prev: string[]) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // skeletonCardTemplate
  const SkeletonCard = () => (
    <View className="rounded-xl overflow-hidden w-44 bg-slate-200/40">
      <View
        className={`${
          isOpaque ? 'opacity-60' : 'opacity-100'
        } w-full h-40 bg-slate-200`}
      />
      <View className="px-2 pb-2">
        <View
          className={`${
            isOpaque ? 'opacity-60' : 'opacity-100'
          } h-4 bg-slate-200 rounded-md mt-2`}
        />
        <View className="flex-row items-center justify-between mb-1.5 -ml-0.5 mt-2">
          <View className="flex-row items-center">
            <View
              className={`${
                isOpaque ? 'opacity-60' : 'opacity-100'
              } h-4 w-16 bg-slate-200 rounded-md`}
            />
          </View>
          <View className="flex-row items-center justify-center">
            <View
              className={`${
                isOpaque ? 'opacity-60' : 'opacity-100'
              } h-4 w-4 bg-slate-200 rounded-md`}
            />
            <View
              className={`${
                isOpaque ? 'opacity-60' : 'opacity-100'
              } h-4 w-8 bg-slate-200 rounded-md ml-1`}
            />
          </View>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <View
            className={`${
              isOpaque ? 'opacity-60' : 'opacity-100'
            } h-8 w-8 bg-slate-200 rounded-md`}
          />
          <View
            className={`${
              isOpaque ? 'opacity-60' : 'opacity-100'
            } h-4 w-8 bg-slate-200 rounded-md`}
          />
          <View
            className={`${
              isOpaque ? 'opacity-60' : 'opacity-100'
            } h-8 w-8 bg-slate-200 rounded-md`}
          />
        </View>
      </View>
    </View>
  );

  interface Item {
    id: string;
    name: string;
    photos: { url: string }[];
    current_price: { USD: number }[];
  }

  // Card
  const Card = ({ item }: { item: Item }) => {
    const quantity = quantities[item.id] || 0;
    const isFavorite = favorites.includes(item.id);

    return (
      <View className="rounded-xl overflow-hidden w-44 bg-slate-300/30">
        <Image
          source={{
            uri:
              `https://api.timbu.cloud/images/${item.photos[0].url}` ||
              'https://i.ibb.co/sQmZc0x/watch-5.webp',
          }}
          className="w-full h-40 object-center object-cover"
        />
        <TouchableOpacity
          className="absolute rounded-full top-2 right-2 p-2 bg-[#f1f5f9]"
          onPress={() => handleToggleFavorite(item.id)}
        >
          <Entypo
            name={isFavorite ? 'heart' : 'heart-outlined'}
            size={16}
            color={'#1e293b'}
          />
        </TouchableOpacity>

        <View className="px-2 pb-2">
          <Text className="text-slate-800 text-lg mb-0.5" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center justify-between mb-1.5 -ml-0.5">
            <View className="flex-row items-center">
              <MaterialIcons name="attach-money" size={14} color="#1e293b" />
              <Text className="text-slate-800 font-semibold -ml-0.5">
                {item.current_price[0].USD}
              </Text>
            </View>
            <View className="flex-row items-center justify-center">
              <MaterialIcons name="star" size={12} color={'#1e293b'} />
              <Text className="text-slate-800 text-xs">4.5</Text>
            </View>
          </View>
          {/* btn */}
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => handleMinusQuantity(item.id)}
              className="p-2 rounded-md bg-[#f1f5f9]"
            >
              <Entypo name="minus" size={18} color={'#1e293b'} />
            </TouchableOpacity>
            <Text className="text-slate-800">{quantity}</Text>
            <TouchableOpacity
              onPress={() => handleAddQuantity(item.id)}
              className="p-2 rounded-md bg-[#f1f5f9]"
            >
              <MaterialIcons name="add" size={18} color={'#1e293b'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      className={`${
        Platform.OS === 'android' ? 'pt-4' : ''
      } flex-1 bg-slate-100`}
    >
      <StatusBar
        animated={true}
        backgroundColor="#f1f5f9"
        barStyle={'dark-content'}
        showHideTransition={'slide'}
      />
      {loading ? (
        <FlatList
          data={[...Array(numColumns * 5).keys()]} // Dummy data for skeleton cards
          keyExtractor={(item, index) => index.toString()}
          key={numColumns}
          numColumns={numColumns}
          className="px-2"
          ListEmptyComponent={
            <View className="h-[80vh] items-center justify-center">
              <Text className="text-3xl text-slate-800">No items found</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListHeaderComponent={
            <Text className="text-xl text-slate-800 text-center mb-3">
              Products
            </Text>
          }
          renderItem={() => <SkeletonCard />}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          key={numColumns}
          numColumns={numColumns}
          className="px-2"
          ListEmptyComponent={
            <View className="h-[80vh] items-center justify-center">
              <Text className="text-3xl text-slate-800">No items found</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListHeaderComponent={
            <Text className="text-xl text-slate-800 text-center mb-3">
              Products
            </Text>
          }
          ListFooterComponent={<Text className="mb-2" />}
          renderItem={({ item }) => <Card item={item} />}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      )}
    </SafeAreaView>
  );
}
