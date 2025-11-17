export const usersData = {
    labels: ['% Active', '% Not Active'],
    datasets: [
        {
        label: 'Users',
        data: [81, 100 - 81],
        backgroundColor: [
            'rgb(54, 62, 235)',
            'rgb(180, 190, 200)'
        ],
        borderColor: [
            'rgb(54, 62, 235)',
            'rgb(180, 190, 200)'
        ],
        borderWidth: 1,
        hoverOffset: 4
        }
    ]
};

export const membersData = {
    labels: ['% Accepted', '% Not Accepted'],
    datasets: [
      {
        label: 'Members',
        data: [62, 100 - 62],
        backgroundColor: [
          'rgb(54, 62, 235)',
          'rgb(180, 190, 200)'
        ],
        borderColor: [
          'rgb(54, 62, 235)',
          'rgb(180, 190, 200)'
        ],
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
};

export const paymentsData = {
    labels: ['% Online', '% Offline'],
    datasets: [
      {
        label: 'Payments',
        data: [44, 100 - 44],
        backgroundColor: [
          'rgb(54, 62, 235)',
          'rgb(180, 190, 200)'
        ],
        borderColor: [
          'rgb(54, 62, 235)',
          'rgb(180, 190, 200)'
        ],
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
};